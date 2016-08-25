import {Projector} from 'maquette';
import {createChatList, destroyChatList} from '../components/chat-list';
import {DataService} from '../services/data-service';
import {UserService} from '../services/user-service';

import {createPage} from '../components/page';
import {UserInfo} from '../interfaces';

export let createChatPage = (dataService: DataService, userService: UserService, toUserId: string, projector: Projector) => {

  let username = '';
  let setOtherUser = (otheruser: UserInfo) => { 
    username = `${otheruser.firstName} ${otheruser.lastName}`;
    projector.scheduleRender();
  }

  return createPage({
    backButton: {title: '⬅', route: '#users'},
    dataService,
    userService,
    projector,
    body: [
      createChatList({dataService: dataService, user: userService.getUserInfo(), projector: projector}, {toUserId: () => toUserId, getOtherUser: setOtherUser})
    ], destroy: () => {
      destroyChatList();
    }
  }, {title: () => { 
    if (username) { 
      return `chat with ${username}`;
    } else {
      return 'chat'
    }
  } });
};
