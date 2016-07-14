import {Component, VNode, h} from 'maquette';
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
  let {dataService, title, body, destroy} = config;
  let getTitle = typeof title === 'string' ? () => title : title;
  let page: Page = {
    destroy,
    renderHeader: () => {
      return h('div', { class: styles.header }, [
        // backButton
        h('span', { class: styles.title }, [getTitle()])
      ])
    },
    renderBody: () => {
      return h('div', { class: styles.page, key: page }, [
        body.map(c => c.renderMaquette())
      ]);
    }
  };
  return page;
};
