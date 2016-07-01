import {h, Projector, Component} from 'maquette';
let styles = <any>require('./app.css');

import {UserInfo} from '../interfaces';
import {createRegisterPage} from '../pages/register-page';
import {createUserListPage} from '../pages/user-list-page';
import {randomId} from '../utilities';
import {Router} from '../services/router';
import {UserService} from '../services/user-service';

export let createApp = (horizon: any, store: LocalForage, router: Router, userService: UserService, projector: Projector) => {

    let registerPage = createRegisterPage(userService, randomId());

    return {
        renderMaquette: () => {
            return h('body', { class: styles.app }, [
                userService.getUserInfo() ? router.renderMaquette() : registerPage.renderMaquette()
            ]);
        }
    }
};
