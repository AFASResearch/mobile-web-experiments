import {h, Projector, Component} from 'maquette';
let styles = <any>require('./app.css');

import {UserInfo} from '../../interfaces';
import {createRegisterPage} from '../register-page/register-page';

export let createApp = (horizon: any, store: LocalForage, userInfo: UserInfo, projector: Projector) => {

  let users = horizon('users');

  let updateUserInfo = (newUserInfo: UserInfo) => {
    users.upsert(newUserInfo).subscribe({
      error: (msg: Object) => {console.error(msg)},
      complete: () => {
        store.setItem('user-info', newUserInfo).then(() => {
          userInfo = newUserInfo;
          projector.scheduleRender();
        });
      }
    });
  };

  let registerPage: Component;
  if (!userInfo) {
    registerPage = createRegisterPage(updateUserInfo, Math.random().toString(36).substr(2));
  }
  let router = {
    renderMaquette: () => h('span', ['ROUTER'])
  };

  return {
    renderMaquette: () => {
      return h('body', {class: styles.app}, [
        userInfo ? router.renderMaquette() : registerPage.renderMaquette()
      ]);
    }
  }
};
