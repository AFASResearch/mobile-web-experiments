import {Projector, h} from 'maquette';
import {createList} from '../components/list';
import {DataService} from '../services/data-service';
import {createPage} from '../components/page';
import {createMessageComposer} from '../components/message-composer';
import {UserInfo, MessageInfo} from '../interfaces';
import {nameOfUser, randomId, getFormattedDate} from '../utilities';

export let createChatList = (dataService: DataService, user: UserInfo, toUserId: string, projector: Projector) => {

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

  let list = createList({}, {
    getItems: () => messages,
    getKey: (message: MessageInfo) => message.id,
    renderRow: (item: MessageInfo) => {
      return h('div', { class: 'row' }, [
        h('img', { class: 'profile-picture', src: item.fromUserId === toUserId ? otherUser.image : user.image }),
        h('div', { class: 'messagecontainer' }, [
          h('div', {class: 'messageTitleContainer'}, [
            h('b', [item.fromUserId === toUserId ? otherUser.firstName : 'me']),
            h('i', [getFormattedDate(item.date)])
          ]),
          h('span', [item.text])
        ])
      ]);
    }
  });
  
  return list;
};
