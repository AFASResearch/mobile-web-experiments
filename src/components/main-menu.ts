import {h, Projector} from 'maquette';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
let Hammer = <any>require('hammerjs');
require('../styles/main-menu.scss');

const MENU_ITEMS: { text: string, route: string }[] = [
  {
    text: 'People',
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


export interface MainMenuEntry {
  key: string;
  title: string;
  projector: Projector;
}

export let createMainMenu = (dataService: DataService, userService: UserService, projector: Projector) => {
  let isOpen = false;
  let user = userService.getUserInfo();

  let handleOverlayClick = (evt: Event) => {
    evt.preventDefault();
    isOpen = false;
  };

  let handleMenuButtonClick = (evt: Event) => {
    evt.preventDefault();
    isOpen = true;
  };

  let handleItemClick = (evt: Event) => {
    isOpen = false;
    // not preventing default, so the url changes and routing kicks in
  };


let initialiseTouchGesturesAfterCreate = () => {
  let myElement: HTMLElement = document.getElementById('swipeMenuBox');

  // create a simple instance
  // by default, it only adds horizontal recognizers
  let mc: any = new Hammer(myElement);

  // listen to events...
  mc.on(" panright", function(evt: any) {
      isOpen = true;
      projector.scheduleRender();
  });
}

let swipeBackafterCreate = () => { 

  let overlay: HTMLElement = document.getElementById('overlay');

  // create a simple instance
  // by default, it only adds horizontal recognizers
  let touchAreaSwipeObj: any = new Hammer(overlay);

  // listen to events...
  touchAreaSwipeObj.on("panleft", function(evt: any) {
      isOpen = false;
      projector.scheduleRender();
  });
}

  let menu = {
    renderMaquette: () => {
      return h('div', { key: menu, class: 'mainMenu', afterCreate: initialiseTouchGesturesAfterCreate,  }, [
        isOpen ? h('div', { key: 'overlay', id: 'overlay', class: 'overlay', onclick: handleOverlayClick, afterCreate: swipeBackafterCreate }) : undefined,
        h('div', { key: 'touchArea', id: 'touchArea', class: 'touchArea', classes: { ['isOpen']: isOpen} }, [
          isOpen ? [
            h('div', { class: 'menu' }, [
              h('div', { class: 'item'}, [
                user ? [
                h('a', {class: 'navbar-username', href: '#account', onclick: handleItemClick}, [user.firstName + ' ' + user.lastName]),
                h('img', {src: user.image, class: 'profile-picture', height: 20})
                ] : undefined
              ]),
              MENU_ITEMS.map(item => h('div', { class: 'item' }, [
                h('a', { href: `#${item.route}`, onclick: handleItemClick }, [item.text])
              ])),
              h('div', { class: 'item' }, [dataService.isOnline() ? 'DB Connected' : 'DB Not connected'])
            ])
          ] : undefined
        ]),
        h('div', { key: 'openButton', class: 'openButton', onclick: handleMenuButtonClick }, ['☰']),
        h('div', { key: 'openButton', id: 'swipeMenuBox'}, [])
      ]);
    }
  };
  return menu;
};
