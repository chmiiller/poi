/**
* This exposes the native PoiApi module as a JS module. This has a
* function 'getPointsOfInterest' which takes the following parameter:

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

And it returns an array with the length of two where the first item is a summary object of the query:
{
    "totalResults": Number,
    "queryTime": Number,
    "numResults": Number,
    "query": String
}
and the second is an array of results (if any) with the following structure:
[
     {
        "id": String,
        "dist": Number,
        "name": String,
        "phone": String,
        "address": String,
    },
]
*/
import { NativeModules } from 'react-native';
const { PoiApi } = NativeModules;
export default PoiApi;