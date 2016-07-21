import {h} from 'maquette';
require('../styles/text.scss');

export interface TextConfig {
  htmlContent: string;
}

export let createText = (config: TextConfig) => {
  let {htmlContent} = config;
  return {
    renderMaquette: () => {
      return h('p', { class: "text", innerHTML: htmlContent });
    }
  };
};
