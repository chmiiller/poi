//
//  PoiApi.swift
//  poi
//
//  Created by Carlos Zinato on 15/06/2021.
//

@objc(PoiApi)
class PoiApi: NSObject {
  
  func parseSummary(data: Data) -> [String: AnyObject] {
      var summary: [String: AnyObject] = [:]
      do {
          let json = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.mutableContainers)
          if let dict = json as? [String: AnyObject] {
              if let result = dict["summary"] as? [String: AnyObject] {
                  summary = result
              }
          }
      } catch {
          print(error)
      }
      return summary
  }
  
  func parseJsonData(data: Data) -> [[String:Any]] {
      var points: [[String:Any]] = []
      do {
          let json = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.mutableContainers)
          if let dict = json as? [String: AnyObject] {
              if let results = dict["results"] as? [AnyObject] {
                  for resultItem in results {
                    var item: [String: Any] = [:]
                    item["id"] = resultItem["id"] as? String
                    item["dist"] = resultItem["dist"] as? NSNumber
                    let poi = resultItem["poi"] as! [String: AnyObject]
                    item["name"] = poi["name"] as? String
                    item["phone"] = poi["phone"] as? String
                    let address = resultItem["address"] as! [String: AnyObject]
                    item["address"] = address["freeformAddress"] as? String
                    points.append(item)
                  }
              }
          }
      } catch {
          print(error)
      }
      return points
  }
  
  @objc(getPointsOfInterest:resolver:rejecter:)
  func getPointsOfInterest(_ object: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    let baseUrl = object["baseUrl"] ?? "https://api.tomtom.com"
    let apiKey = object["apiKey"] ?? ""
    let term = object["term"] ?? ""
    let limit = object["limit"] ?? "10"
    let lat = object["lat"] ?? ""
    let lon = object["lon"] ?? ""
    let radius = object["radius"] ?? "5000"
    let apiUrl = URL(string: "\(baseUrl)/search/2/poiSearch/\(term).json?typeahead=false&limit=\(limit)&lat=\(lat)&lon=\(lon)&radius=\(radius)&key=\(apiKey)")!
    let request = URLRequest(url: apiUrl)
    let task = URLSession.shared.dataTask(with: request, completionHandler: { (data, response, error) -> Void in
      if let error = error {
          reject("Something went wrong", "error", error)
          return
      }

      if let data = data {
        let summary = self.parseSummary(data: data)
        let pointsOfInterest = self.parseJsonData(data: data)
        resolve([summary, pointsOfInterest]);
      }
    })
    task.resume()
  }

   @objc
   func constantsToExport() -> [String: Any]! {
     return ["BASE_URL": "https://api.tomtom.com"]
   }

}
