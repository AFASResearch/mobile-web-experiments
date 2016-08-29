import {Projector} from 'maquette';
import {RouteRegistry} from '../route-registry';
import {Page} from '../components/page';

export interface Router {
  getCurrentPage: () => Page;
}

export let createRouter = (window: Window, projector: Projector, registry: RouteRegistry): Router => {
  let hash = window.location.hash.substr(1);
  let page: Page;

  window.onhashchange = (evt) => {
    projector.scheduleRender();
    hash = window.location.hash;
    if (page && page.destroy) {
      page.destroy();
    }
    page = registry.initializePage(hash.substr(1)); // strips the # token
  };

  return {
    getCurrentPage: () => {
      if (!page) {
        page = registry.initializePage(hash);
      }
      return page;
    }
  };
};
