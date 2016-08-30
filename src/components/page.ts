import {Component, VNode, h, Projector} from 'maquette';
import {DataService} from '../services/data-service';
import {UserService} from '../services/user-service';

import {createMainMenu} from './main-menu';

require('../styles/page.scss');

declare let window: any; 
declare let navigator: any;

export interface PageConfig {
  dataService: DataService;
  userService: UserService;
  projector: Projector;
  className?: string;
  sideBarVisible?: boolean;
  backButton?: {
    title: string;
    route: string;
  };
  destroy?(): void;
  // Note: the body components should handle scrolling themselves
  body: Component[];
}

export interface PageBindings { 
  title: () => string;
}

export interface Page {
  renderHeader(): VNode;
  renderBody(): VNode;
  destroy?(): void;
  hasBackButton?(): boolean;
}

export let createPage = (config: PageConfig, bindings: PageBindings): Page => {
  let {body, backButton, destroy, className, dataService, userService, projector, sideBarVisible} = config;
  let {title} = bindings; 

  let runningiOS = 'standalone' in navigator && !navigator.standalone && (/iphone|ipod|ipad/gi).test(navigator.platform) && (/Safari/i).test(navigator.appVersion);

  let page: Page = {
    hasBackButton: () => {
      return backButton !== undefined;
    },
    destroy,
    renderHeader: () => {
      return h('span', { class: 'title'}, [
        backButton ? h('a', {class: 'backbutton', href: backButton.route}, [ 
          h('img', {src: 'icons/arrow_back.png'})
        ]) : undefined,
       h('span', {class: 'titleText'}, [ title() ] )
      ]);
    },
    renderBody: () => {
      return h('div', { class: className ? `page ${className}` : 'page', key: page, styles: {'height': runningiOS ? 'calc(100vh - 40px - 10pt)' : 'calc(100vh - 40px)' } }, [
        body.map(c => c.renderMaquette())
      ]);
    }
  }; 
  return page;
};
