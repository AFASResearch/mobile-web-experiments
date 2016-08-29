Experimental chat app which uses only web technologies. Used for demonstrations.

This chat app consists has three folders that can be built. One for web, one for Electron and one for cordova. Build instructions can be found below. 

#Initial installation
To run the application, install Rethinkdb and execute the following commands:

```
$ npm install -g horizon webpack
$ npm install
$ webpack
$ hz serve --dev --bind $IP --port $PORT
```
Good luck

#Running on Cordova
for the cordova part, install cordova:

```
$ npm install -g cordova
```

and cd into the folder:
```
$ cd cordova-demo
```

Also install the SDK's for the desired platforms. (Xcode for iOS, Android SDK, etc.)
after all that; you will be able to run the following command:   
```
$ cordova prepare
```

(If this does not work, delete all plugins and platforms in the 'plugins' and 'platforms' folder. Then try again.)

followed by one of the following:
```
$ cordova run browser
$ cordova run android
$ cordova run ios
$ cordova run wp8
```

Cordova does need to compile for specific , and therefore the bundle.js needs to be put in a specific path: 
To edit the files for cordova, take the bundle.js from the dist folder and put it inside the /cordova-demo/www/js folder.

#Running on Electron
Electron works a bit different compared to Cordova. This electron application uses the (now for development) __localhost:8181__ as source. 
This means that updating the web version will also update the electron version. For production you probably want to change this url. 

To start the app: enter the folder with the electron code:

```
$ cd electron-demo
```

After that, start it with:

```
$ npm start
```

