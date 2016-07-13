import {Component, h} from 'maquette';
import {DataService} from '../../services/data-service';
import {createMainMenu} from '../../components/main-menu/main-menu';

let styles = <any>require('./page.css');

export interface PageConfig {
  title: string | (() => string);
  dataService: DataService,
  backButton?: {
    title: string;
    route: string;
  };
  // Note: the body components should handle scrolling themselves
  body: Component[];
}

let mainMenu = createMainMenu();

export let createPage = (config: PageConfig) => {
  let {dataService, title, body} = config;
  let page = {
    renderMaquette: () => {
      let renderTitle = typeof title === 'string' ? title : title();
      return h('div', { class: styles.page, key: page }, [
        mainMenu.renderMaquette(),
        h('div', { class: styles.header }, [
          // backButton
          h('span', { class: styles.title }, [renderTitle]),
          h('div', { class: styles.status }, [dataService.isOnline() ? 'V' : 'X'])
        ]),
        h('div', { class: styles.body }, [
          config.body.map(c => c.renderMaquette())
        ])
      ]);
    }
  };
  return page;
};
