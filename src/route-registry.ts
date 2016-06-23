import {Projector} from 'maquette';
import {RouteRegistry, UserInfo} from './interfaces';
import {createUserListPage} from './pages/user-list-page';
import {createChatPage} from './pages/chat-page';

export let createRouteRegistry = (horizon: any, projector: Projector, user: UserInfo): RouteRegistry => { return {
  initializePage: (route: string) => {
    switch(route) {
      case 'users':
        return createUserListPage(horizon, projector);
      default: 
        let match = /chat\/(\w+)/.exec(route);
        if (match) {
          return createChatPage(horizon, user, match[1], projector)
        }
    }
  }};
};