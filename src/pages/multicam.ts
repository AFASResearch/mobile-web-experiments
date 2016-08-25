import {createPage} from '../components/page';
import {createCamera, destroyCamera} from '../components/camera';
import {DataService} from '../services/data-service';
import {UserService} from '../services/user-service';
import {Projector} from 'maquette';

export let createMultiCamPage = (dataService: DataService, userService: UserService, projector: Projector) => {
  return createPage({
    className: 'card',
    dataService,
    userService,
    projector,
    body: [
      createCamera({ projector: projector}, {})
    ],
    destroy: () => destroyCamera()
  }, {title: () => 'Switch between cameras' });
};
