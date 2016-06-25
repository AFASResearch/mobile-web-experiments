import {h, Projector, Component} from 'maquette';
let styles = <any>require('./app.css');

import {UserInfo} from '../interfaces';
import {createRegisterPage} from '../pages/register-page';
import {createUserListPage} from '../pages/user-list-page';
import {randomId} from '../utilities';
import {Router} from '../router';

export let createApp = (horizon: any, store: LocalForage, userInfo: UserInfo, router: Router, projector: Projector) => {

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

  let registerPage = createRegisterPage(updateUserInfo, randomId());

  return {
    renderMaquette: () => {
      return h('body', {class: styles.app}, [
        userInfo ? router.renderMaquette() : registerPage.renderMaquette()
      ]);
    }
  }
};
