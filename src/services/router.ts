import {Projector, Component} from 'maquette';
import {RouteRegistry, Page} from '../interfaces';

export interface Router extends Component {
}

export let createRouter = (window: Window, projector: Projector, registry: RouteRegistry): Router => {
    let hash = window.location.hash.substr(1);
    let page: Page = registry.initializePage(hash);

    window.onhashchange = (evt) => {
        projector.scheduleRender();
        hash = window.location.hash;
        if (page && page.destroy) {
            page.destroy();
        }
        page = registry.initializePage(hash.substr(1)); // strips the # token
    }

    return {
        renderMaquette: () => page.renderMaquette()
    };
}
