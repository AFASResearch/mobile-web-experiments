import {Projector} from 'maquette';
import {createList} from '../components/list/list';
import {createPage} from '../components/page/page';
import {createTextField} from '../components/text-field/text-field';
import {createMessageComposer} from '../components/message-composer/message-composer';
import {UserInfo, MessageInfo} from '../interfaces';
import {nameOfUser, randomId} from '../utilities';

export let createChatPage = (horizon: any, user: UserInfo, toUserId: string, projector: Projector) => {
  let otherUser: UserInfo;
  let messages: MessageInfo[];
  let chatRoomId = [user.id, toUserId].sort().join('-'); // format: lowestUserId-highestUserId

  let otherUserSubscription = horizon('users').find(toUserId).watch().subscribe((user: UserInfo) => {
    otherUser = user;
    projector.scheduleRender();
  });

  let messagesSubscription = horizon('directMessages')
    .findAll(
      {chatRoomId: chatRoomId}
    )
    .order('timestamp', 'descending')
    .limit(500)
    .watch()
    .subscribe((msgs: MessageInfo[]) => {
      projector.scheduleRender();
      messages = msgs.sort((msg1, msg2) => msg1.timestamp - msg2.timestamp); 
    });

  let list = createList({columns: [{header: 'From', key: 'from'}, {header:'Message', key:'message'}]}, {
    getItems: () => messages,
    getKey: (message: MessageInfo) => message.id,
    renderCell: (item: MessageInfo, columnKey: string) => {
      switch(columnKey) {
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
    horizon('directMessages').upsert(message);
  }

  let messageComposer = createMessageComposer({sendMessage});

  return createPage({
    title: () => `Chat with ${nameOfUser(otherUser)}`,
    body: [
      list,
      messageComposer
    ]
  });
}
