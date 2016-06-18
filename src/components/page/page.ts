import {Component, h} from 'maquette';
let styles = <any>require('./page.css');

export interface PageConfig {
  title: string;
  backButton?: {
    title: string;
    route: string;
  };
  // Note: the body components should handle scrolling themselves
  body: Component[];
}

export let createPage = (config: PageConfig) => {
  let {title, body} = config;
  return {
    renderMaquette: () => {
      return h('div', {class: styles.page}, [
        h('div', {class: styles.header}, [
          // backButton
          h('span', [title])
        ]),
        h('div', {class: styles.body}, [
          config.body.map(c => c.renderMaquette())
        ])
      ]);
    }
  };
};
