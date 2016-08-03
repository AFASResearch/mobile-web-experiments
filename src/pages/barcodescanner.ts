import {createPage} from '../components/page';
import {createLiveCamera} from '../components/live-camera';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
require('quagga');

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
