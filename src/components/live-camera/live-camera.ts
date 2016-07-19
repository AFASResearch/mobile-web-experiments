import {h, Component} from 'maquette';

let styles = <any>require('./live-camera.css');

export let createLiveCamera = (button: Component) => {
    return {
        renderMaquette: () => {
            return h('div', [
                h('video', { id: "video", width: '320', height: '240' }),
                button.renderMaquette()
            ])
        }
    }
}


