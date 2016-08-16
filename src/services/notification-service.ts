/*
* This service is able to send notifications to the device.
* It first checks for a Cordova/Electron/Browser app.
*/

import {NotificationInfo} from '../interfaces';

declare let window: any; // declare window as any since Electron changes it
declare let Notification: any; // declare Notification as any since Electron adds it.
declare let cordova: any; // declare cordova

let sendCordovaNotification = ( obj: NotificationInfo ) => {
  // source: https://github.com/katzer/cordova-plugin-local-notifications
  // for (at least) cordova we could be sending additional data into the notification
  // we might need to wait for device ready before cordova may fire the notification
  document.addEventListener('deviceready', () => {
    cordova.plugins.notification.local.schedule({
      // id: 10,
      title: obj.title,
      text: obj.body
      // data: { meetingId: '#123FG8' }
    });
  }, false);
};

let sendBrowserNotification = ( obj: NotificationInfo ) => {
  if (!('Notification' in window)) {
    alert('This browser does not support system notifications');
  } else if (Notification.permission === 'granted') {
    new Notification(obj.title, obj);
  } else if (Notification.permission !== 'denied') {   // if no permission, we need to ask the user.
    Notification.requestPermission((permission: string) => {
      if (permission === 'granted') {  // If the user accepts, let's create a notification
        new Notification(obj.title, obj);
      }
    });
  }
  // Notification permission has been denied...
};

export let sendNotification = ( obj: NotificationInfo ) => {
if (typeof cordova !== 'undefined') {
    sendCordovaNotification(obj);
  } else { // standard browser support & Electron
    sendBrowserNotification(obj);
  }
};

/* cordova onclick functions for notifications

cordova.plugins.notification.local.on('click', function (notification: any) {
if (notification.id === 10) {
// joinMeeting(notification.data.meetingId);
// console.log('notification has been clicked');
}
});

// Notification has reached its trigger time (Tomorrow at 8:45 AM)
cordova.plugins.notification.local.on('trigger', function (notification: any) {
if (notification.id !== 10) {
return;
}
// After 10 minutes update notification's title
setTimeout(function () {
cordova.plugins.notification.local.update({
id: 10,
title: 'Meeting in 5 minutes!'
});
}, 600000);
});

*/
