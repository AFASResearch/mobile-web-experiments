import {Projector} from 'maquette';
import {createList} from '../components/list/list';
import {createPage} from '../components/page/page';
import {createTextField} from '../components/text-field/text-field';
import {UserInfo, MessageInfo} from '../interfaces';

export let createChatPage = (horizon: any, user: UserInfo, toUserId: string, projector: Projector) => {
  let otherUser: UserInfo;
  let messages: MessageInfo[];

  let otherUserSubscription = horizon('users').find(toUserId).watch().subscribe((user: UserInfo) => {
    otherUser = user;
    projector.scheduleRender();
  });

  let messagesSubscription = horizon('messages')
    .findAll(
      {from: user.id, to: toUserId}, {from: toUserId, to: user.id}
    )
//    .order("date", "descending")
    .watch()
    .subscribe((msgs: MessageInfo[]) => { messages = msgs; });

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

  return createPage({
    title: 'Chat with user ...',
    body: [list]
  });
}