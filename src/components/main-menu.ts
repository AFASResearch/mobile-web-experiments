import {h} from 'maquette';
import {UserService} from './services/user-service';
import {DataService} from './services/data-service';
require('../styles/main-menu.scss');

const MENU_ITEMS: { text: string, route: string }[] = [
  {
    text: 'About me',
    route: 'account'
  },
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
}

export let createMainMenu = (dataService: DataService, userService: UserService) => {
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

  return {
    renderMaquette: () => {
      return h('div', { class: 'mainMenu' }, [
        isOpen ? h('div', { key: 'overlay', class: 'overlay', onclick: handleOverlayClick }) : undefined,
        h('div', { key: 'touchArea', class: 'touchArea', classes: { ['isOpen']: isOpen } }, [
          isOpen ? [
            h('div', { class: 'menu' }, [
              h('div' { class: 'currentuser-holder'}, [
                h('img', {src: user.image, class: 'profile-picture', height: 20}),
                h('a', {class: 'navbar-username', href: '#account'}, [user.firstName + ' ' + user.lastName])
              ]),
              h('div', { class: 'status' }, [dataService.isOnline() ? 'DB Connected' : 'DB Not connected']),
              MENU_ITEMS.map(item => h('div', { class: 'item' }, [
                h('a', { href: `#${item.route}`, onclick: handleItemClick }, [item.text])
              ]))
            ])
          ] : undefined
        ]),
        h('div', { key: 'openButton', class: 'openButton', onclick: handleMenuButtonClick }, ['☰'])
      ]);
    }
  };
};
