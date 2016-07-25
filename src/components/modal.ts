import {h, Component} from 'maquette';
require('../styles/modal.scss');

export interface ModalConfig {
    isOpen: Boolean;
    title: string;
    contents: Component[];
}

export interface ModalBindings {
    toggleModal: () => void;
}

export let createModal = (config: ModalConfig, bindings: ModalBindings) => {
    let {isOpen, title, contents} = config;
    let {toggleModal} = bindings;

    return {
        renderMaquette: () => {
            if (isOpen) {
               return  h('div', { class: 'modal' }, [
                    h('div', { class: 'modalContent' }, [
                        h('div', { class: 'modalHeader' }, [
                            title,
                            h('div', { class: 'close', onclick: toggleModal}, ['X'])
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
