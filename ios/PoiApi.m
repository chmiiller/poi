//
//  PoiApi.m
//  poi
//
//  Created by Carlos Zinato on 15/06/2021.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

@interface RCT_EXTERN_MODULE(PoiApi, NSObject)

RCT_EXTERN_METHOD(getPointsOfInterest: (NSDictionary *)object resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject);

@end
