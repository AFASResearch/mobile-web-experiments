import {h, Projector} from 'maquette';

import {createRegisterPage} from './pages/register-page';
import {randomId} from './utilities';
import {Router} from './services/router';
import {UserService} from './services/user-service';
import {DataService} from './services/data-service';
import {createMainMenu} from './components/main-menu';

require("./styles/app.scss");

export let createApp = (dataService: DataService, store: LocalForage, router: Router, userService: UserService, projector: Projector) => {

  let registerPage = createRegisterPage(dataService, userService, projector, randomId());
  let mainMenu = createMainMenu();

  return {
    renderMaquette: () => {
      let currentPage = userService.getUserInfo() ? router.getCurrentPage() : registerPage;

      return h('body', { class: "app" }, [
        h('div', { class: "header" }, [
          mainMenu.renderMaquette(),
          currentPage.renderHeader(),
          h('div', { class: "status" }, [dataService.isOnline() ? 'DB Connected' : 'DB Not connected'])
        ]),
        h('div', { key: currentPage, class: "body" }, [
          currentPage.renderBody()
        ])
      ]);
    }
  };
};
