/*
* This service is able to send notifications to the device.
* It first checks for a Cordova/Electron/Browser app.
*/

import {NotificationInfo} from '../interfaces';

declare let window: any; // declare window as any since Electron changes it
declare let Notification: any; // declare Notification as any since Electron adds it.
declare let cordova: any; // declare cordova

export let sendNotification = ( obj: NotificationInfo ) => {
  if (window && window.process && window.process.type) {    // if we are running in Electron
      new Notification(obj.title, obj);
  } else if (cordova !== undefined ) { // if we are running in Cordova

     // https://github.com/katzer/cordova-plugin-local-notifications

     // we might need to wait for device ready before cordova may fire the notification
     document.addEventListener('deviceready', function () {
         // Schedule notification for tomorrow to remember about the meeting
        cordova.plugins.notification.local.schedule({
//          id: 10,
            title: obj.title,
            text: obj.body,
//          data: { meetingId: '#123FG8' }
        });
     }, false);

  } else {
    // here we could do standard browser support
  }
};

 /*
 // Join BBM Meeting when user has clicked on the notification
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
