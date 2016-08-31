import {createPage} from '../components/page';
import {Projector} from 'maquette';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
import {createBarcodeCamera, destroyBarcodeCamera} from '../components/Barcode-camera';

export let createBarcodePage = (dataService: DataService, userService: UserService, projector: Projector) => {
  return createPage({
    className: 'card',
    dataService,
    userService,
    projector,
    body: [
      createBarcodeCamera({ projector: projector }, {})
    ], destroy: () => {
      destroyBarcodeCamera();
    }
  }, {title: () => 'Scan a barcode' });
};
