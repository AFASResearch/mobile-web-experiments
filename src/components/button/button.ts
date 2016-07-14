import {h} from 'maquette';
let styles = <any>require('./button.css');

export interface ButtonConfig {
  text: string;
  primary?: boolean;
}

export interface ButtonBindings {
  onClick: () => void;
}

export let createButton = (config: ButtonConfig, bindings: ButtonBindings) => {

  let handleClick = (evt: Event) => {
    evt.preventDefault();
    bindings.onClick();
  };

  return {
    renderMaquette: () => {
      return h('button', { class: styles.button, classes: { [styles.primary]: config.primary }, onclick: handleClick }, [
        config.text
      ]);
    }
  };
};
