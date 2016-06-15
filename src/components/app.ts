import {h, Projector} from 'maquette';

import {UserInfo} from '../interfaces';

export let createApp = (horizon: any, store: LocalForage, userInfo: UserInfo, projector: Projector) => {
  return {
    renderMaquette: () => {
      return h('body', ['App started, userInfo: '+userInfo]);
    }
  }
};
