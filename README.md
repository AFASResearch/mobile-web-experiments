Experimental chat app which uses only web technologies. Used for demonstrations.

#Initial installation
To run the application, install Rethinkdb and execute the following commands:

```
npm install -g horizon webpack
npm install
webpack
hz serve --dev --bind $IP --port $PORT
```
Good luck

#Running on Cordova
for the cordova part, install cordova

```
$ npm install -g cordova
```

and cd into the folder:
```
$ cd cordova-mobile-web-experiments
```

Also install the SDK's for the desired platforms. (Xcode for iOS, Android SDK, etc.)
after all that; you will be able to run the following command:   
```
cordova prepare
```

If this does not work, delete all plugins and platforms in the 'plugins' and 'platforms' folder. Then try again.

followed by one of the following:
```
cordova run browser
cordova run android
cordova run ios
cordova run wp8
```

To edit the files for cordova, take the bundle.js from the dist folder and put it inside the /cordova-mobile-web-experiments/www/js folder

#Running on Electron

enter the folder with the electron code:

```
$ cd electron-mobile-web-experiments
```

After that, start it with:

```
$ npm start
```

To edit the files for Electron, take the bundle.js from the dist folder and put it inside the /electron-mobile-web-experiments folder
