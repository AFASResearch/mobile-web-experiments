import {createPage} from '../components/page';
import {createCamera} from '../components/camera';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
require('quagga');

export let createMultiCamPage = (dataService: DataService, userService: UserService, projector: any) => {

    let page = createPage({
        title: 'Multicam testing',
        dataService,
        body: [
            createCamera({ projector: projector}, {})
        ]
    });
    return page;
};
