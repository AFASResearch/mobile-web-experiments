import './service-worker-registration';

import Horizon = require('@horizon/client');
import localforage = require('localforage');
import {createProjector} from 'maquette';

import {UserInfo} from './interfaces';
import {createApp} from './app/app';
import {createRouter} from './services/router';
import {createDataService} from './services/data-service';
import {createRouteRegistry} from './route-registry'
import {createUserService} from './services/user-service'

// Bootstrapping code

let horizon = Horizon();
let store = (localforage as any as LocalForage).createInstance({ storeName: 'collaboration' });

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
}

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
