import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {UserInfo} from '../interfaces';
import {createPage} from '../components/page';
import {createUserList} from '../components/user-list.ts';
import {createChatList} from '../components/chat-list.ts';

export let createUserListPage = (dataService: DataService, user: UserInfo, projector: Projector) => {
  let chatRoomId = 'izbhn78g0th';

  let handleClick = (itemId: string) => {
    chatRoomId = itemId; // <-- works
  };

  let userlist = createUserList(dataService, user, projector, handleClick);
  let chatlist = createChatList({dataService: dataService, user: user, projector: projector}, {toUserId: () => chatRoomId});

  let page = createPage({
    title: 'Chat',
    dataService,
    body: [ { renderMaquette: () => {
      return h('div', {class: 'chatPagesHolder'}, [
        userlist.renderMaquette(),
        chatlist.renderMaquette()
    ]);
    }
  }
    ],
    destroy: () => {
      // subscription.unsubscribe();
    }
  });
  return page;
};
