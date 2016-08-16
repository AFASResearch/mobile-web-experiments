import {h, Projector} from 'maquette';
import {createRegisterPage} from './pages/register-page';
import {randomId} from './utilities';
import {Router} from './services/router';
import {UserService} from './services/user-service';
import {DataService} from './services/data-service';
import {NotificationInfo} from './interfaces';
import {sendNotification} from './services/notification-service';
import {createMainMenu} from './components/main-menu';
require('./styles/app.scss');

declare let Object: any;
declare let cordova: any;
declare let localNotification: any;

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

let notification: NotificationInfo = {title: 'test notificatie titel', body: 'body'};
sendNotification(notification);

export let createApp = (dataService: DataService, store: LocalForage, router: Router, userService: UserService, projector: Projector) => {

  let registerPage = createRegisterPage(dataService, userService, projector, randomId());
  let mainMenu = createMainMenu();

  return {
    renderMaquette: () => {

      let user = userService.getUserInfo();

      let currentPage = user ? router.getCurrentPage() : registerPage;

      return h('body', { class: 'app' }, [
        h('div', { class: 'header' }, [
          currentPage.renderHeader(),
          h('div', { class: 'currentuser-holder' }, [user ? [
            h('img', {src: user.image, class: 'profile-picture', height: 20}),
            h('span', {class: 'navbar-username'}, [user.firstName + ' ' + user.lastName])
          ] : undefined]),
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
