import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {UserService} from '../services/user-service';
import {UserInfo} from '../interfaces';
import {createPage} from '../components/page';
import {createUserList, destroyUserList} from '../components/user-list.ts';
import {createChatList, destroyChatList} from '../components/chat-list.ts';

export let createUserListPage = (dataService: DataService, userService: UserService, projector: Projector) => {

  let handleClick = (itemId: string) => {
    (window as any).location = `#chat/${itemId}` ;
  };

  // create the components
  let userlist = createUserList(dataService, userService.getUserInfo(), projector, handleClick);

  let page = createPage({
    dataService,
    userService,
    projector,
    body: [ {
      renderMaquette: () => {
        return h('div',  {class: 'card chatPagesHolder'}, [
          userlist.renderMaquette()
        ]);
      }
    }],
    destroy: () => {
      destroyUserList();
      destroyChatList();
    }
  }, {title: () => {
      return 'Users'
  } });
  return page;
};
