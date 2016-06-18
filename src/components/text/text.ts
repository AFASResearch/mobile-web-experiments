import {h} from 'maquette';

let styles = <any>require('./text.css');

export interface TextConfig {
  htmlContent: string;
}

export let createText = (config: TextConfig) => {
  let {htmlContent} = config;
  return {
    renderMaquette: () => {
      return h('p', {class: styles.text, innerHTML: htmlContent})
    }
  }
}
