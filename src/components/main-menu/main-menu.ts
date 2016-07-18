import {h} from 'maquette';
let styles = <any>require('./main-menu.css');

const MENU_ITEMS: { text: string, route: string }[] = [
  {
    text: 'About me',
    route: 'account'
  },
  {
    text: 'People',
    route: 'users'
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
      return h('div', { class: styles.mainMenu }, [
        isOpen ? h('div', { key: 'overlay', class: styles.overlay, onclick: handleOverlayClick }) : undefined,
        h('div', { key: 'touchArea', class: styles.touchArea, classes: { [styles.isOpen]: isOpen } }, [
          isOpen ? [
            h('div', { class: styles.menu }, [
              MENU_ITEMS.map(item => h('div', { class: styles.item }, [
                h('a', { href: `#${item.route}`, onclick: handleItemClick }, [item.text])
              ]))
            ])
          ] : undefined
        ]),
        h('div', { key: 'openButton', class: styles.openButton, onclick: handleMenuButtonClick }, ['☰'])
      ]);
    }
  };
};
