import {h} from 'maquette';
let styles = <any>require('./live-camera.css');

export let createLiveCamera = () => {
    return { 
        renderMaquette: () => {
            return h('video', {id: "video", width: '320', height: '240'})
         }
    }
}


