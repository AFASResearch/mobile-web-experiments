import {h, Projector} from 'maquette';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
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
  },
  {
    text: 'More',
    route: 'more'
  }
];


export interface MainMenuEntry {
  key: string;
  title: string;
  projector: Projector;
}

export let createMainMenu = (dataService: DataService, userService: UserService, projector: Projector) => {
  let user = userService.getUserInfo();

  let menu = {
    renderMaquette: () => {
      return h('div', { key: menu, class: 'mainMenu'}, [
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
                h('a', { href: `#${item.route}` }, [item.text])
              ])),
              h('div', { class: 'item' }, [dataService.isOnline() ? 'DB Connected' : 'DB Not connected'])
            ])
          ]
        ]),
      ]);
    }
  };
  return menu;
};
