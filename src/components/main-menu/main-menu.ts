import {h, VNode} from 'maquette';
let styles = <any>require('./list.css');

const MENU_ITEMS: {text: string, route: string}[] = [
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

export interface MainMenuConfig {
    entries: MainMenuEntry[];
}

export interface MainMenuBindings {
    onClick(entry: MainMenuEntry): void;
}

export let createMainMenu = (config: MainMenuConfig, bindings: MainMenuBindings) => {
  let isOpen = false;

  return {
    renderMaquette: () => {
      return h('div', { class: styles.mainMenu }, [
        h('div', {class: styles.openButton}, ['M']),
        h('div', {class: styles.touchArea, classes: {[styles.isOpen]: isOpen}}, [
          isOpen ? h('div', {class: styles.menu}, [
            MENU_ITEMS.map(item => h('div', {class: styles.item}, [
              h('a', {href: `#{item.route}`}, [item.text])
            ]))
          ]) : undefined
        ])
      ]);
    }
  }
}
