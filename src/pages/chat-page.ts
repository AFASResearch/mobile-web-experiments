import {Projector, h} from 'maquette';
import {createList} from '../components/list';
import {DataService} from '../services/data-service';
import {createPage} from '../components/page';
import {createMessageComposer} from '../components/message-composer';
import {UserInfo, MessageInfo} from '../interfaces';
import {nameOfUser, randomId} from '../utilities';

export let createChatPage = (dataService: DataService, user: UserInfo, toUserId: string, projector: Projector) => {
  let otherUser: UserInfo;
  let messages: MessageInfo[];
  let chatRoomId = [user.id, toUserId].sort().join('-'); // format: lowestUserId-highestUserId

  let otherUserSubscription = dataService.horizon('users').find(toUserId).watch().subscribe((userInfo: UserInfo) => {
    otherUser = userInfo;
    projector.scheduleRender();
  });

  let messagesSubscription = dataService.horizon('directMessages')
    .findAll({ chatRoomId: chatRoomId })
    .order('timestamp', 'descending')
    .limit(500)
    .watch()
    .subscribe((msgs: MessageInfo[]) => {
      projector.scheduleRender();
      messages = msgs.sort((msg1, msg2) => msg1.timestamp - msg2.timestamp);
    });

  let list = createList({ columns: [{ header: 'Picture', key: 'image' }, { header: 'From', key: 'from' }, { header: 'Message', key: 'message' }] }, {
    getItems: () => messages,
    getKey: (message: MessageInfo) => message.id,
    renderCell: (item: MessageInfo, columnKey: string) => {
      switch (columnKey) {
        case 'image':
          return h('img', { class: 'profile-picture', src: item.fromUserId === toUserId ? otherUser.image : user.image });
        case 'from':
          return item.fromUserId === toUserId ? otherUser.firstName : 'me';
        case 'message':
          return item.text;
      }
    }
  });

  let sendMessage = (text: string) => {
    let message: MessageInfo = {
      date: new Date(),
      timestamp: new Date().valueOf(),
      fromUserId: user.id,
      id: randomId(),
      chatRoomId,
      text,
      toUserId
    };
    dataService.horizon('directMessages').upsert(message);
  };

  let messageComposer = createMessageComposer({ sendMessage });

  return createPage({
    title: () => `Chat with ${nameOfUser(otherUser)}`,
    dataService,
    body: [
      list,
      messageComposer
    ],
    destroy: () => {
      otherUserSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    }
  });
};
