import {h, Component} from 'maquette';

export let createScroller = (body: Component[]) => {

  let setSmoothScroll = (elem: HTMLDivElement) => {
    elem.setAttribute('style', '-webkit-overflow-scrolling: touch');
  };

  return {
    renderMaquette: () => {
      return h('div.scroller.scroll-allowed', { afterCreate: setSmoothScroll }, body.map(c => c.renderMaquette()));
    }
  };
};
