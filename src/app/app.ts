import {h, Projector, Component} from 'maquette';
let styles = <any>require('./app.css');

import {UserInfo} from '../interfaces';
import {createRegisterPage} from '../pages/register-page';
import {createUserListPage} from '../pages/user-list-page';

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

  let registerPage = createRegisterPage(updateUserInfo, Math.random().toString(36).substr(2));
  let userListPage = createUserListPage(horizon, projector);
  let router = {
    renderMaquette: () => {
      return userListPage.renderMaquette();
    }
  };

  return {
    renderMaquette: () => {
      return h('body', {class: styles.app}, [
        userInfo ? router.renderMaquette() : registerPage.renderMaquette()
      ]);
    }
  }
};
