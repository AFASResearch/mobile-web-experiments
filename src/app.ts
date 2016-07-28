import {h, Projector} from 'maquette';

import {createRegisterPage} from './pages/register-page';
import {randomId} from './utilities';
import {Router} from './services/router';
import {UserService} from './services/user-service';
import {DataService} from './services/data-service';
import {createMainMenu} from './components/main-menu';
require('./styles/app.scss');

//polyfill for object assign, since it is not supported by android.
if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
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

document.addEventListener('deviceready', onDeviceReady, false);


function onDeviceReady() {
    console.log(navigator.camera); // cordova creates the camera class
    alert('camera loaded');
}

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
