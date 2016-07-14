import {h, Projector} from 'maquette';
let styles = <any>require('./app.css');

import {createRegisterPage} from '../pages/register-page';
import {randomId} from '../utilities';
import {Router} from '../services/router';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
import {createMainMenu} from '../components/main-menu/main-menu';

export let createApp = (dataService: DataService, store: LocalForage, router: Router, userService: UserService, projector: Projector) => {

  let registerPage = createRegisterPage(dataService, userService, randomId());
  let mainMenu = createMainMenu();

  return {
    renderMaquette: () => {
      let currentPage = userService.getUserInfo() ? router.getCurrentPage() : registerPage;

      return h('body', { class: styles.app }, [
        h('div', { class: styles.header }, [
          mainMenu.renderMaquette(),
          currentPage.renderHeader(),
          h('div', { class: styles.status }, [dataService.isOnline() ? 'V' : 'X'])
        ]),
        h('div', { key: currentPage, class: styles.body }, [
          currentPage.renderBody()
        ])
      ]);
    }
  };
};
