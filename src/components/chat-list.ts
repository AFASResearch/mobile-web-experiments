import {Projector, h} from 'maquette';
import {createList} from '../components/list';
import {DataService} from '../services/data-service';
import {UserInfo, MessageInfo} from '../interfaces';
import {getFormattedDate, randomId} from '../utilities';
import {createMessageComposer} from '../components/message-composer';

require('../styles/chat-list.scss');

export interface ChatListConfig {
  dataService: DataService;
  user: UserInfo;
  projector: Projector;
}

export interface ChatListBindings {
  toUserId: () => string;
}

export let createChatList = (config: ChatListConfig, bindings: ChatListBindings) => {

  let {dataService, user, projector} = config;
  let {toUserId} = bindings;
  let otherUserSubscription: any;
  let messagesSubscription: any;
  let oldUserId: string;
  let otherUser: UserInfo;
  let messages: MessageInfo[];
  let chatRoomId = [user.id, toUserId()].sort().join('-'); // format: lowestUserId-highestUserId

  let updateChatRoomId = () => {
    chatRoomId = [user.id, toUserId()].sort().join('-'); // format: lowestUserId-highestUserId
  };

  let updateOtherUserSubscription = () => {
    otherUserSubscription = dataService.horizon('users').find(toUserId()).watch().subscribe(
      (userInfo: UserInfo) => {
        otherUser = userInfo;
        projector.scheduleRender();
      });
    };

    let updateMessagesSubscription = () => {
      messagesSubscription = dataService.horizon('directMessages')
      .findAll({ chatRoomId: chatRoomId })
      .order('timestamp', 'descending')
      .limit(500)
      .watch()
      .subscribe((msgs: MessageInfo[]) => {
        if (msgs.length > 0) {
          projector.scheduleRender();
          messages = msgs.sort((msg1, msg2) => msg1.timestamp - msg2.timestamp);

          let objDiv = document.getElementsByClassName('chat-list')[0];
          if (objDiv !== null) {
            objDiv.scrollTop = objDiv.scrollHeight;
          }

        } else {
          let firstMessage: MessageInfo;

           firstMessage = {
            id: '',
            chatRoomId: chatRoomId, // format: see chat-page
            fromUserId: user.id,
            toUserId: toUserId(),
            text: 'maak je eerste bericht',
            date: new Date(),
            timestamp: 0
          };

          messages = [firstMessage];
        }
      });
    };

    // run these functions for the first time on create
    updateChatRoomId();
    updateOtherUserSubscription();
    updateMessagesSubscription();

    let sendMessage = (text: string) => {
    let date = new Date();

    let message: MessageInfo = {
       id: randomId(),
       chatRoomId: chatRoomId, // format: see chat-page
       fromUserId: user.id,
       toUserId: chatRoomId,
       text: text,
       date: date,
       timestamp: date.valueOf()
     };
     dataService.horizon('directMessages').upsert(message);
   };

   let messageComposer = createMessageComposer({ sendMessage });

    let list = createList({className: 'chat-list'}, {
      getItems: () => messages,
      getKey: (message: MessageInfo) => message.id,
      renderRow: (item: MessageInfo) => {
        let userId = toUserId();

        // if the user id of the other user has changed...
        if (userId !== oldUserId) {
          updateChatRoomId();
          updateOtherUserSubscription();
          updateMessagesSubscription();
          oldUserId = userId;
        }

        return h('div', { class: 'row' }, [
          h('img', { class: 'profile-picture', src: item.fromUserId === userId ? otherUser.image : user.image }),
          h('div', {key: item.timestamp, class: 'messagecontainer' }, [
            h('div', { class: 'messageTitleContainer'}, [
              h('b', [item.fromUserId === userId ? otherUser.firstName : 'me']),
              h('i', [getFormattedDate(item.date)])
            ]),
            h('span', [item.text])
          ])
        ]);
      },
      renderFooter: () => {
        return messageComposer.renderMaquette();
      }
    });

    return list;
  };
