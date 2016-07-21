import {createPage} from '../components/page';
import {createText} from '../components/text';
import {createModal} from '../components/modal';
import {createTextField} from '../components/text-field';
import {createButton} from '../components/button';
import {createLiveCamera} from '../components/live-camera';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';

const Quagga = <any>require('quagga');

import {Projector, h, Component} from 'maquette';

export let createBarcodePage = (dataService: DataService, userService: UserService, projector: any) => {

  let page = createPage({
    title: 'Barcodescanning',
    dataService,
    body: [
                  createLiveCamera({ projector: projector, BarcodeScanEnabled: true }, {}), 

    //   {
    //     renderMaquette: () => {
    //       return h('div', { class: "camera-container" }, [
    //         h('h2', [detectedCode]),
    //         h('input', { type: "file", capture: 'camera', accept: 'image/*', id: 'takePictureField', onchange: getPicture }),

    //         // after the DOM is loaded we will try to load the video in it
    //         h('div', { id: 'barcodeScanViewHolder', class: 'viewport', afterCreate: startDecoding }),

    //       ]);
    //     }
    //   },

    ]
  });
  return page;
};

