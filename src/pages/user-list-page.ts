import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {UserService} from '../services/user-service';
import {UserInfo} from '../interfaces';
import {createPage} from '../components/page';
import {createUserList, destroyUserList} from '../components/user-list.ts';
import {createChatList, destroyChatList} from '../components/chat-list.ts';

export let createUserListPage = (dataService: DataService, userService: UserService, projector: Projector) => {
  let chatRoomId = '';

  let w = <any>window;
  let ResponsiveMode = false;

  let checkResponsiveMode = () => {
    if (w.innerWidth < 796) {
      ResponsiveMode = true;
    } else {
      ResponsiveMode = false;
    }
  };

  w.addEventListener('resize', () => {
    checkResponsiveMode();
    projector.scheduleRender();
  });

  let handleClick = (itemId: string) => {
    // small screens
    if (ResponsiveMode) {
      w.location = `#chat/${itemId}` ;
    } else { // large screens
      chatRoomId = itemId;
    }
  };


  let username = '';
  let setOtherUser = (otheruser: UserInfo) => { 
    if (otheruser) {
      username = `${otheruser.firstName} ${otheruser.lastName}`;
      projector.scheduleRender();
    }
  }


  // check responsive mode on start
  checkResponsiveMode();

  // create the components
  let userlist = createUserList(dataService, userService.getUserInfo(), projector, handleClick);
  let chatlist = createChatList({dataService: dataService, user: userService.getUserInfo(), projector: projector}, {toUserId: () => chatRoomId, getOtherUser: setOtherUser});

  let page = createPage({
    dataService,
    userService,
    projector,
    body: [ {
      renderMaquette: () => {
        return h('div',  {class: 'card chatPagesHolder'}, [
          userlist.renderMaquette(),
          !ResponsiveMode ? [
            chatRoomId === '' ? h('div', {class: 'chat-list no-chat-selected'}, ['Choose someone to chat with']) : chatlist.renderMaquette()
          ] : undefined
        ]);
      }
    }],
    destroy: () => {
      destroyUserList();
      destroyChatList();
    }
  }, {title: () => { 
    if (username) { 
      return `Chat with ${username}`;
    } else {
      return 'Chat'
    }
  } });
  return page;
};
