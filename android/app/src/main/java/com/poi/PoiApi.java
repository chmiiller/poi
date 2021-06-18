package com.poi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;
import java.util.HashMap;

import java.io.IOException;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import org.json.JSONArray;
import org.json.JSONObject;

public class PoiApi extends ReactContextBaseJavaModule {

    PoiApi(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "PoiApi";
    }

    OkHttpClient client = new OkHttpClient();

    String okRun(String url) throws IOException {
        Request request = new Request.Builder()
                .url(url)
                .build();

        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }

    @ReactMethod
    public void getPointsOfInterest(ReadableMap object, Promise promise) {
        try {
            String baseUrl = object.getString("baseUrl");
            String apiKey = object.getString("apiKey");
            String term = object.getString("term");
            String limit = object.getString("limit");
            String lat = object.getString("lat");
            String lon = object.getString("lon");
            String radius = object.getString("radius");

            WritableArray reactResult = Arguments.createArray();

            String url = "" + baseUrl + "/search/2/poiSearch/" + term + ".json?typeahead=false&limit=" + limit + "&lat=" + lat + "&lon=" + lon + "&radius=" + radius + "&key=" + apiKey;
            String response = okRun(url);
            JSONObject jObject = new JSONObject(response);

            JSONObject summary = jObject.getJSONObject("summary");
            String query = summary.getString("query");
            Double queryTime = summary.getDouble("queryTime");
            Double numResults = summary.getDouble("numResults");
            Double totalResults = summary.getDouble("totalResults");

            WritableMap reactSummary = Arguments.createMap();
            reactSummary.putString("query", query);
            reactSummary.putDouble("queryTime", queryTime);
            reactSummary.putDouble("numResults", numResults);
            reactSummary.putDouble("totalResults", totalResults);

            reactResult.pushMap(reactSummary);

            String results = jObject.getString("results");

            JSONArray resultsArray = new JSONArray(results);
            WritableArray pointsOfInterest = Arguments.createArray();

            for (int i = 0; i < resultsArray.length(); i++) {
                JSONObject item = resultsArray.getJSONObject(i);
                String id = item.getString("id");
                Double dist = item.getDouble("dist");

                JSONObject poi = item.getJSONObject("poi");
                String name = poi.getString("name");
                String phone = "";

                if (poi.has("phone") && !poi.isNull("phone")) {
                    phone = poi.getString("phone");
                }

                JSONObject address = item.getJSONObject("address");
                String freeformAddress = address.getString("freeformAddress");

                WritableMap reactItem = Arguments.createMap();
                reactItem.putString("id", id);
                reactItem.putDouble("dist", dist);
                reactItem.putString("name", name);
                reactItem.putString("phone", phone);
                reactItem.putString("address", freeformAddress);

                pointsOfInterest.pushMap(reactItem);
            }
            reactResult.pushArray(pointsOfInterest);

            promise.resolve(reactResult);
        } catch(Exception e) {
            promise.reject("Create Event Error", e);
        }
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("BASE_URL", "https://api.tomtom.com");
        return constants;
    }
}