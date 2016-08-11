import {Projector} from 'maquette';
import {createChatList} from '../components/chat-list';
import {DataService} from '../services/data-service';
import {createPage} from '../components/page';
import {UserInfo} from '../interfaces';

export let createChatPage = (dataService: DataService, user: UserInfo, toUserId: string, projector: Projector) => {

  let chatlist = createChatList({dataService: dataService, user: user, projector: projector}, {toUserId: () => toUserId});

  return createPage({
    title: () => ``,
    dataService,
    body: [
      chatlist
    ]
  });
};
