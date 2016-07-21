import {h, Component} from 'maquette';
require('../styles/button.scss');

export interface ButtonConfig {
  text: string;
  primary?: boolean;
}

export interface ButtonBindings {
  onClick: () => void;
}

export let createButton = (config: ButtonConfig, bindings: ButtonBindings): Component => {

  let handleClick = (evt: Event) => {
    evt.preventDefault();
    bindings.onClick();
  };

  return {
    renderMaquette: () => {
      return h('button', { class: "button", classes: { ["primary"]: config.primary }, onclick: handleClick }, [
        config.text
      ]);
    }
  };
};
