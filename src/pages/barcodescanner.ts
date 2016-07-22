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
            createLiveCamera({ projector: projector, BarcodeScanEnabled: true }, {})
        ]
    });
    return page;
};

