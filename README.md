# poi (Points of Interest)
This is an assignment project created by Carlos Zinato.   

![Demo](./docs/assets/demo.gif)

## Purpose of this project       
The idea of this app is to suggest places around users location using TomTom's "poiSearch" endpoint. Besides that, this project also works as a proof of concept of how easy/simple it's to make all the API request and response parsing in a native module.
In this case, the iOS native module is written with Swift and the Android one with Java.

## Requirements   
In order to run this app, I'm using the following tools and versions:
* NodeJS: 12.18.3
* yarn: 1.22.4
* Xcode: 12.2
* iOS Simulators 14.2
* Android Studio: 4.2.1
* ReactJS: 17.0.1
* React Native: 0.64.2

## Building   
First clone or download this repository and in a terminal shell type:
```
$ yarn start
```
Or this one if you're not using Yarn but NPM
```
$ npm run start
```
This will clean the project, install all dependencies, prepare the Podfile for iOS and start React's Metro Bundler.   
PS: Note that this script will make use of `npx react-native` so you don't even need react-native cli installed on your machine   

After that, in **another** terminal shell, `cd` to the repository and use:
```
$ npx react-native run-ios
```
to run the app in an iOS simulator or
```
$ npx react-native run-android
```
to run it in an Android connected device.    


## Dependencies
Besides the React Native Native Modules written specifically for this app, there's only one dependency added to this project. This dependency is the [react-native-location](https://github.com/timfpark/react-native-location) library. React Native doesn't implement location or geo location APIs out of the box and at their [documentation](https://reactnative.dev/docs/0.63/geolocation) they suggest users to use a community package instead.

## React Native Native Modules
A Swift and a Java React Native Module were made for this project in order to fetch TomTom's API and parse the responses natively.   

### iOS Native Module
On iOS land, this code can be accessed using Xcode by opening the file `/ios/poi.xcworkspace`. There you can find three main files:
* PoiApi.swift
* PoiApi.m
* poi-Bridging-Header.h

Let's start with the simple ones first: `poi-Bridging-Header.h` is just a Objective-C -> Swift bridge for our module. `PoiApi.m` is where we expose our Objective-C methods to the Swift file using React Native's interfaces.
The `PoiApi.swift` is where the code is. It has 4 methods:

### `parseSummary` and `parseJsonData` methods
This methods, as their names already say, receives as Data object from our API response and parses it the way we prefer to read our data structure, returning a `NSDictionary` or an Array of all items already processed.

### `getPointsOfInterest`
This is an exposed method that can be called from the React Native land. It receives a "configuration" object and calls TomTom's API to fetch Points Of Interest based on the search and location of the user. After fetching this data and parsing them with above mentioned methods, it returns an Array with both a summary of this query and a list of results as a Promise Resolve to the JS side of the app.

### `constantsToExport`
A React Native [method](https://reactnative.dev/docs/native-modules-ios#exporting-constants) that exposes constants that can be read from the JS part of the app


### Android Native Module
On Android land, this code can be accessed using Android Studio or any other IDE by opening the `/android/` directory. On the `/android/app/src/main/java/com/poi/` directory you can find two main files:
* PoiApi.java
* PoiPackage.java

The `PoiPackage.java` file implements `ReactPackage` class and adds our `PoiPackage` module in the list of native modules that React Native needs to know to compile when building our app.

The `PoiApi.java` is where the code is. It has 4 methods:
* [getName](https://reactnative.dev/docs/native-modules-android#module-name): React Native's method that returns the chosen name of our Native Module so that can be used from the JS side of the app
* okRun: simply checks if we can request or not the passed URL (String)
* getConstants: A React Native [method](https://reactnative.dev/docs/native-modules-android#exporting-constants) that exposes constants accessible on the JS land
* getPointsOfInterest:    <br />
This is an exposed method that can be called from the React Native land. It receives a "configuration" object and calls TomTom's API to fetch Points Of Interest based on the search and location of the user. After fetching this data it then parses it using Android's JSONObject and JSONArray in the structure we prefer to handle these results. After iterating through all the results and parsing them this method calls a Promise.resolve function so we have access to these objects on the JS side.

### Using the Native Modules
At `./api/NativePoiModule` we export our `PoiApi` (same name for Android and iOS) Native Module and on `api/index` is where we make use of it importing with `NativePoiModule`. We would then have access to the `getConstants` and `getPointsOfInterest` native implementations. The method `searchPointsOfInterest` is public and available for the search screen to use it and finally query TomTom's API.