import {h} from 'maquette';
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
  }
];

export interface MainMenuEntry {
  key: string;
  title: string;
}

export let createMainMenu = () => {
  let isOpen = false;

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
