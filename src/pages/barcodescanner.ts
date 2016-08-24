import {createPage} from '../components/page';
import {Projector} from 'maquette';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
import {createLiveCamera, destroyLiveCamera} from '../components/live-camera';

export let createBarcodePage = (dataService: DataService, userService: UserService, projector: Projector) => {
  return createPage({
    title: 'Barcodescanning',
    className: 'card',
    dataService,
    userService,
    projector,
    body: [
      createLiveCamera({ projector: projector, BarcodeScanEnabled: true }, {})
    ], destroy: () => {
      destroyLiveCamera();
    }
  });
};
