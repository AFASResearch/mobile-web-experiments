import {Component, VNode, h} from 'maquette';
import {DataService} from '../services/data-service';
require('../styles/page.scss');

export interface PageConfig {
  title: string | (() => string);
  dataService: DataService;
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
  let {title, body, backButton, destroy} = config;

  let getTitle = typeof title === 'string' ? () => title : title;

  let page: Page = {
    destroy,
    renderHeader: () => {
      return h('span', { class: 'title' }, [
      backButton ? h('a', {class: 'backbutton', href: backButton.route}, [backButton.title]) : undefined,
        getTitle()]);
    },
    renderBody: () => {
      return h('div', { class: 'page', key: page }, [
        body.map(c => c.renderMaquette())
      ]);
    }
  };
  return page;
};
