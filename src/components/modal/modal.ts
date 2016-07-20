import {h, Component} from 'maquette';
import {createButton} from '../button/button';
let styles = <any>require('./modal.css');

let showModal = false;

let toggleModal = () => {

    showModal = !showModal;
    console.log(showModal);
}

let buttonConfig = {
    text: 'Use camera',
    primary: false
};


let showModalButton = createButton(buttonConfig, { onClick: toggleModal });

export let createModal = (content: Component) => {
    return {
        renderMaquette: () => {
            let modal = h('div', [
                showModalButton.renderMaquette(),
                h('div',
                    {
                        class: styles.modal,
                        styles: {
                            display: showModal ? 'block' : 'none'
                        }
                    }, [
                        h('div', { class: styles.modalContent }, [
                            h('div', { class: styles.close, onclick: toggleModal }, ['x']),
                            content.renderMaquette()
                        ])
                    ])
            ])
            return modal;
        }
    }
}
