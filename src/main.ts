import Horizon = require('@horizon/client');
import localforage = require('localforage');
import {createProjector} from 'maquette';

import {UserInfo} from './interfaces';
import {createApp} from './app/app';
import {createRouter} from './services/router';
import {createRouteRegistry} from './route-registry'
import {createUserService} from './services/user-service'

// Bootstrapping code

let horizon = Horizon();
let store = (localforage as any as LocalForage).createInstance({ storeName: 'collaboration' });

let horizonReady = false;
let userServiceReady = false;
let projector = createProjector({});
let userService = createUserService(store, projector.scheduleRender);

let startApp = () => {
    userService.initializeHorizon(horizon);
    let router = createRouter(window, projector, createRouteRegistry(horizon, projector, userService));
    let app = createApp(horizon, store, router, userService, projector);
    document.body.innerHTML = '';
    projector.merge(document.body, app.renderMaquette);
}

userService.initialize().then(() => {
    userServiceReady = true;
    if (horizonReady) {
        startApp();
    }
});

horizon.onReady(() => {
    horizonReady = true;
    if (userServiceReady) {
        startApp();
    }
});

horizon.connect();
