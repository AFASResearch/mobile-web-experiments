import {h, Projector} from 'maquette';

import {createRegisterPage} from './pages/register-page';
import {randomId} from './utilities';
import {Router} from './services/router';
import {UserService} from './services/user-service';
import {DataService} from './services/data-service';
import {createMainMenu} from './components/main-menu';
require('./styles/app.scss');

declare let Object: any;
declare let cordova: any;

// polyfill for object assign, since it is not supported by android.
if (typeof Object.assign !== 'function') {
  Object.assign = function(target: any) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    target = Object(target);
    for (let index = 1; index < arguments.length; index++) {
      let source = arguments[index];
      if (source != null) {
        for (let key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

document.addEventListener('deviceready', function () {
    // Schedule notification for tomorrow to remember about the meeting
    cordova.plugins.notification.local.schedule({
        id: 10,
        title: 'Meeting in 15 minutes!',
        text: 'Jour fixe Produktionsbesprechung',
        data: { meetingId: '#123FG8' }
    });

    // Join BBM Meeting when user has clicked on the notification 
    cordova.plugins.notification.local.on("click", function (notification: any) {
        if (notification.id === 10) {
           // joinMeeting(notification.data.meetingId);
           console.log('notification has been clicked');
        }
    });

    // Notification has reached its trigger time (Tomorrow at 8:45 AM)
    cordova.plugins.notification.local.on("trigger", function (notification: any) {
        if (notification.id !== 10)
            return;

        // After 10 minutes update notification's title 
        setTimeout(function () {
            cordova.plugins.notification.local.update({
                id: 10,
                title: 'Meeting in 5 minutes!'
            });
        }, 600000);
    });
}, false);

export let createApp = (dataService: DataService, store: LocalForage, router: Router, userService: UserService, projector: Projector) => {

  let registerPage = createRegisterPage(dataService, userService, projector, randomId());
  let mainMenu = createMainMenu();

  return {
    renderMaquette: () => {
      let currentPage = userService.getUserInfo() ? router.getCurrentPage() : registerPage;

      return h('body', { class: 'app' }, [
        h('div', { class: 'header' }, [
          currentPage.renderHeader(),
          h('div', { class: 'status' }, [dataService.isOnline() ? 'DB Connected' : 'DB Not connected'])
        ]),
        h('div', { key: currentPage, class: 'body' }, [
          mainMenu.renderMaquette(),
          currentPage.renderBody()
        ])
      ]);
    }
  };
};
