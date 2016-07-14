import {Projector} from 'maquette';
import {Page} from './components/page/page';
import {createUserListPage} from './pages/user-list-page';
import {createAccountPage} from './pages/account';
import {createChatPage} from './pages/chat-page';
import {UserService} from './services/user-service';
import {DataService} from './services/data-service';

export interface RouteRegistry {
  initializePage(route: string): Page;
}

export let createRouteRegistry = (dataService: DataService, projector: Projector, userService: UserService): RouteRegistry => {
  return {
    initializePage: (route: string): Page => {
      switch (route) {
        case 'users':
          return createUserListPage(dataService, projector);
        case 'account':
          return createAccountPage(dataService, userService);
        default:
          let match = /chat\/(\w+)/.exec(route);
          if (match) {
            return createChatPage(dataService, userService.getUserInfo(), match[1], projector);
          }
          // Nothing matches, default page:
          return createUserListPage(dataService, projector);
      }
    }
  };
};
