/**
* This exposes the native PoiApi module as a JS module. This has a
* function 'getPointsOfInterest' which takes the following parameters:

* 1. Object with the following format
    {
        baseUrl: String,
        apiKey: String,
        term: String,
        limit: String,
        lat: String,
        lon: String,
        radius: String,
    }
*/
import { NativeModules } from 'react-native';
const { PoiApi } = NativeModules;
export default PoiApi;