import {Projector, Component} from 'maquette';
import {RouteRegistry, Page} from './interfaces';

export let createRouter = (window: Window, projector: Projector, registry: RouteRegistry): Component => {
  let hash = window.location.hash;
  let page: Page = registry.initializePage(hash);

  window.onhashchange = (evt) => {
    projector.scheduleRender();
    hash = window.location.hash;
    if (page && page.destroy) {
      page.destroy();
    }
    page = registry.initializePage(hash);
  }

  return {
    renderMaquette: () => page.renderMaquette()
  };
}
