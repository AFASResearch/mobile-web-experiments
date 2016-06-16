import {h, Projector, Component} from 'maquette';
var styles = <any>require('./app.css');

import {UserInfo} from '../../interfaces';
import {createRegisterPage} from '../register-page/register-page';

export let createApp = (horizon: any, store: LocalForage, userInfo: UserInfo, projector: Projector) => {
  let registerPage: Component;
  if (!userInfo) {
    registerPage = createRegisterPage();
  }
  return {
    renderMaquette: () => {
      return h('body', {class: styles.app}, ['App started, userInfo: '+userInfo]);
    }
  }
};
