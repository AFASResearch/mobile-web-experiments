Experimental chat app which uses only web technologies. Used for demonstrations.

To run the application, install rethinkdb and execute the following commands:

```
npm install -g horizon webpack
npm install
webpack
hz serve --dev --bind $IP --port $PORT
```

for the cordova part, install cordova 

```
$ npm install -g cordova
```

Also install the SDK's for the desired platforms. (Xcode for iOS, Android SDK, etc.)

after all that; you will be able to run  

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

Good luck
