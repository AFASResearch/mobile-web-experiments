import {Component, VNode, h, Projector} from 'maquette';
import {DataService} from '../services/data-service';
import {UserService} from '../services/user-service';

import {createMainMenu} from './main-menu';

require('../styles/page.scss');

export interface PageConfig {
  title: string;
  dataService: DataService;
  userService: UserService;
  projector: Projector;
  className?: string;
  backButton?: {
    title: string;
    route: string;
  };
  destroy?(): void;
  // Note: the body components should handle scrolling themselves
  body: Component[];
}

export interface Page {
  renderHeader(): VNode;
  renderBody(): VNode;
  destroy?(): void;
}

export let createPage = (config: PageConfig): Page => {
  let {title, body, backButton, destroy, className, dataService, userService, projector} = config;

  let mainMenu = createMainMenu(dataService, userService, projector);

  let page: Page = {
    destroy,
    renderHeader: () => {
      return h('span', { class: 'title' }, [
        mainMenu.renderMaquette(),
        backButton ? h('a', {class: 'backbutton', href: backButton.route}, [backButton.title]) : undefined,
        title
      ]);
    },
    renderBody: () => {
      return h('div', { class: className ? `page ${className}` : 'page', key: page }, [
        body.map(c => c.renderMaquette())
      ]);
    }
  };
  return page;
};
