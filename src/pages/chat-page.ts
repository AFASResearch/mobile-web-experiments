import {Projector} from 'maquette';
import {createChatList, destroyChatList} from '../components/chat-list';
import {DataService} from '../services/data-service';
import {UserService} from '../services/user-service';

import {createPage} from '../components/page';
import {UserInfo} from '../interfaces';

export let createChatPage = (dataService: DataService, userService: UserService, toUserId: string, projector: Projector) => {
  return createPage({
    title: '',
    backButton: {title: '⬅', route: '#users'},
    dataService,
    userService,
    projector,
    body: [
      createChatList({dataService: dataService, user: userService.getUserInfo(), projector: projector}, {toUserId: () => toUserId})
    ], destroy: () => {
      destroyChatList();
    }
  });
};
