//import './service-worker-registration';

import Horizon = require('@horizon/client');
const localforage = <any>require('localforage');
import {createProjector} from 'maquette';

import {createApp} from './app';
import {createRouter} from './services/router';
import {createDataService} from './services/data-service';
import {createRouteRegistry} from './route-registry';
import {createUserService} from './services/user-service';

declare let cordova: any;
declare let Notification: any;
declare let window: any;

// for testing on local network
// let horizon = Horizon({host: 'nl1-lbs.afasgroep.nl:8181'});
let horizon: any;

if (typeof cordova !== 'undefined') {
  horizon = Horizon({host: 'localhost:8181'});
} else {
  horizon = Horizon();
}

let store = (localforage).createInstance({ storeName: 'mobile-web-experiments' });

let horizonReady = false;
let userServiceReady = false;
let projector = createProjector({});
let userService = createUserService(store, projector.scheduleRender);
let dataService = createDataService(horizon, projector.scheduleRender);

let startApp = () => {
  userService.initializeHorizon(horizon);
  let router = createRouter(window, projector, createRouteRegistry(dataService, projector, userService));
  let app = createApp(dataService, store, router, userService, projector);
  document.body.innerHTML = '';
  projector.merge(document.body, app.renderMaquette);
};

userService.initialize().then(() => {
  userServiceReady = true;
  if (horizonReady) {
    userService.initializeHorizon(horizon);
  }
  startApp();
});

horizon.onReady(() => {
  horizonReady = true;
  if (userServiceReady) {
    userService.initializeHorizon(horizon);
  }
});

horizon.connect();
