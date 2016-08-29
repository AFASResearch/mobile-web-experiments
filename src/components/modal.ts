/*
This component takes an array of other components as parameter.
It displays a button, and onclick it will show a modal with the given components in it.
*/

import {h, Component} from 'maquette';
require('../styles/modal.scss');

export interface ModalConfig {
  isOpen: Boolean;
  title: string;
  contents: Component[];
  width?: string;
}

export interface ModalBindings {
  toggleModal: () => void;
}

export let createModal = (config: ModalConfig, bindings: ModalBindings) => {
  let {isOpen, /* title, */ contents, width} = config;
  let {toggleModal} = bindings;

  return {
    renderMaquette: () => {
      if (isOpen) {
        return  h('div', { class: 'modal' }, [
        h('div', {class: 'modalOverlay', onclick: toggleModal}),
          h('div', { class: 'modalContent', styles: {width: width ?  width : undefined}  }, [
            h('div', { class: 'modalHeader' }, [
              // title,
              h('div', { class: 'close', onclick: toggleModal}, ['x']) // X will be the closing button.
            ]),
            contents.map(c => c.renderMaquette())
          ])
        ]);
      } else {
        return undefined;
      }
    }
  };
};
