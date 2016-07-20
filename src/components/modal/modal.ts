import {h, Component} from 'maquette';
let styles = <any>require('./modal.css');

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
               return  h('div', { class: styles.modal }, [
                    h('div', { class: styles.modalContent }, [
                        h('div', { class: styles.modalHeader }, [
                            title,
                            h('div', { class: styles.close, onclick: toggleModal}, ['X']),
                        ]),
                        contents.map(c => c.renderMaquette())
                    ])
                ])
            } else { 
                return undefined; 
            }
        }
    }
}
