import {h, Component} from 'maquette';

let styles = <any>require('./live-camera.css');

export interface LiveCameraConfig {
}
export interface LiveCameraBindings {
    startCameraAfterCreate: () => void; 
}

export let createLiveCamera = (config: LiveCameraConfig, bindings: LiveCameraBindings) => {
    let {startCameraAfterCreate} = bindings;

    return {
        renderMaquette: () => {
            return h('div', {class: styles.liveCameraHolder}, [
                h('video', { id: "video", width: '320', height: '240', afterCreate: startCameraAfterCreate }),
            ])
        }
    }
}


