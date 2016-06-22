import {Projector} from 'maquette';
import {createList} from '../components/list/list';
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
    .order("date", "descending").limit(500)
    .watch().subscribe((msgs: MessageInfo[]) => { messages = msgs; });

  let list = createList({columns: [{header: 'From', key: 'from'}]}, {});
}