import {h, Projector} from 'maquette';
import {createRegisterPage} from './pages/register-page';
import {randomId} from './utilities';
import {Router} from './services/router';
import {UserService} from './services/user-service';
import {DataService} from './services/data-service';
import {createMainMenu} from './components/main-menu';
let Snap = <any>require('snapjs');
require('./styles/app.scss');
require('./styles/main-menu.scss');
declare let window: any;
declare let cordova: any;
declare let localNotification: any;
declare let Object: any;

let snapper: any;

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

// code to retrieve the electron variable

if (typeof window.require !== 'undefined') {
  console.log(window.require('electron'));
}

const MENU_ITEMS: { text: string, route: string }[] = [
  {
    text: 'Chat',
    route: 'users'
  },
  {
    text: 'Scan Barcodes',
    route: 'barcodescanner'
  },
  {
    text: 'Upload files',
    route: 'file-upload'
  },
  {
    text: 'Multiple camera support',
    route: 'camera'
  }
];

export let createApp = (dataService: DataService, store: LocalForage, router: Router, userService: UserService, projector: Projector) => {

  let registerPage = createRegisterPage(dataService, userService, projector, randomId());

  let createSnapAfterCreate = () => { 
   snapper = new Snap({
      element: document.getElementById('body'),
      dragger: null,
      disable: 'right',
      addBodyClasses: true,
      hyperextensible: true,
      resistance: 0.5,
      flickThreshold: 50,
      transitionSpeed: 0.3,
      easing: 'ease',
      maxPosition: 266,
      minPosition: -266,
      tapToClose: true,
      touchToDrag: true,
      slideIntent: 40,
      minDragDistance: 5
    });
  }

  let closeSnapper = () => { 
    snapper.close();
  }

  let handleMenuButtonClick = () => { 
     if( snapper.state().state=="left" ){
        snapper.close();
    } else {
        snapper.open('left');
    }
  }


  return {
    renderMaquette: () => {

      let user = userService.getUserInfo();
      let currentPage = user ? router.getCurrentPage() : registerPage;

      return h('body', { class: 'app' }, [
      h('div', { key: 0, class: 'mainMenu'}, [
        h('div', { key: 'touchArea', id: 'touchArea', class: 'touchArea' }, [
            [
            h('div', { class: 'menu' }, [
              h('div', { class: 'item'}, [
                user ? [
                h('a', {class: 'navbar-username', href: '#account'}, [user.firstName + ' ' + user.lastName]),
                h('img', {src: user.image, class: 'profile-picture', height: 20})
                ] : undefined
              ]),
              MENU_ITEMS.map(item => h('div', { class: 'item' }, [
                h('a', { onclick: closeSnapper, href: `#${item.route}` }, [item.text])
              ])),
              h('div', { class: 'item' }, [dataService.isOnline() ? 'DB Connected' : 'DB Not connected'])
            ])
          ] 
        ]),
      ]),

        h('div', { id: 'body', key: currentPage, class: 'body', afterCreate: createSnapAfterCreate }, [
        h('div', { class: 'header' }, [
          !currentPage.hasBackButton() ? h('div', { key: 'openButton', class: 'openButton', onclick: handleMenuButtonClick }, ['☰']) : undefined,
          currentPage.renderHeader()
        ]),
          currentPage.renderBody()
        ])
      ]);
    }
  };
};
