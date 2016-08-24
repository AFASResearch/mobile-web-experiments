import {h, Projector} from 'maquette';
import {createRegisterPage} from './pages/register-page';
import {randomId} from './utilities';
import {Router} from './services/router';
import {UserService} from './services/user-service';
import {DataService} from './services/data-service';
require('./styles/app.scss');

declare let cordova: any;
declare let localNotification: any;
declare let Object: any;

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

export let createApp = (dataService: DataService, store: LocalForage, router: Router, userService: UserService, projector: Projector) => {

  let registerPage = createRegisterPage(dataService, userService, projector, randomId());
 // let mainMenu = createMainMenu(dataService, userService, projector);

  return {
    renderMaquette: () => {

      let user = userService.getUserInfo();

      let currentPage = user ? router.getCurrentPage() : registerPage;

      return h('body', {id: 'app', class: 'app' }, [
        h('div', { class: 'header' }, [
          currentPage.renderHeader()
        ]),
        h('div', { key: currentPage, class: 'body' }, [
         // mainMenu.renderMaquette(),
          currentPage.renderBody()
        ])
      ]);
    }
  };
};
