import {Projector} from 'maquette';
import {RouteRegistry, UserInfo} from './interfaces';
import {createUserListPage} from './pages/user-list-page';
import {createChatPage} from './pages/chat-page';
import {UserService} from './services/user-service';

export let createRouteRegistry = (horizon: any, projector: Projector, userService: UserService): RouteRegistry => {
    return {
        initializePage: (route: string) => {
            switch (route) {
                case 'users':
                    return createUserListPage(horizon, projector);
                default:
                    let match = /chat\/(\w+)/.exec(route);
                    if (match) {
                        return createChatPage(horizon, userService.getUserInfo(), match[1], projector)
                    }
                    // Nothing matches, default page:
                    return createUserListPage(horizon, projector);
            }
        }
    };
};
