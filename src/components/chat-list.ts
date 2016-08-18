/*
* This component generates a List with chat messages when a certain chatroomId is given.
* It also handles the database connection. It contains user information at the top of the list and
* a message composer at the footer of the list.
*/

import {Projector, h} from 'maquette';
import {createList} from '../components/list';
import {createMessageComposer} from '../components/message-composer';
import {DataService} from '../services/data-service';
import {UserInfo, MessageInfo} from '../interfaces';
import {getFormattedDate, randomId} from '../utilities';
import {createContactInfo} from '../components/contact-info';
require('../styles/chat-list.scss');

let otherUserSubscription: any;
let messagesSubscription: any;

export interface ChatListConfig {
  dataService: DataService;
  user: UserInfo;
  projector: Projector;
}

export interface ChatListBindings {
  toUserId?: () => string;
}

export let createChatList = (config: ChatListConfig, bindings: ChatListBindings) => {
  let {dataService, user, projector} = config;
  let {toUserId} = bindings;

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

    let scrollpage = () => {
      let objDiv = document.getElementById('chat-list-listHolder');
      if (objDiv !== null && objDiv !== undefined) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    };

    let updateMessagesSubscription = () => {
      messagesSubscription = dataService.horizon('directMessages')
      .findAll({ chatRoomId: chatRoomId })
      .order('timestamp', 'descending')
      .limit(500)
      .watch()
      .subscribe((msgs: MessageInfo[]) => {
        // if there is a new message, append it and sort the array
        if (msgs.length > 0) {
          projector.scheduleRender();
          messages = msgs.sort((msg1, msg2) => msg1.timestamp - msg2.timestamp);
        } else { // if there are no messages, then make a fake message with some nice text
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

    // run these functions for the first time
    updateChatRoomId();
    updateOtherUserSubscription();
    updateMessagesSubscription();

    let messageComposer = createMessageComposer({ sendMessage });
    let contactInfo = createContactInfo({}, {user: () => otherUser});

    return createList({className: 'chat-list'}, {
      getItems: () => messages,
      getKey: (message: MessageInfo) => message.id,
      renderHeader: () => {
        if (contactInfo) {
          return contactInfo.renderMaquette(); // set the contactinfo component in the header.
        }
      },
      // renderRow renders a row for each item in the messages array.
      renderRow: (item: MessageInfo) => {
        let userId = toUserId();

        // if the user id of the other user has changed, we need to change the queries of the database
        if (userId !== oldUserId) {
          updateChatRoomId();
          updateOtherUserSubscription();
          updateMessagesSubscription();

          oldUserId = userId;
        }

        return h('div', { class: 'chatrow', afterCreate: scrollpage }, [

          item.fromUserId === userId ?
          [
          h('img', { class: 'profile-picture', src: item.fromUserId === userId ? otherUser.image : user.image }),

          h('div', {key: item.timestamp, class: 'messagecontainer' }, [
            h('div', { class: 'messageTitleContainer'}, [
              h('b', [ otherUser.firstName ]),
              h('span', {class: 'messageTimeStamp'}, [getFormattedDate(item.date)])
            ]),
            h('span', [item.text])
          ])
        ] : [

          h('div', {key: item.timestamp, class: 'messagecontainer right' }, [
            h('div', { class: 'messageTitleContainer'}, [
              h('b', ['me']),
              h('span', {class: 'messageTimeStamp'}, [getFormattedDate(item.date)])
            ]),
            h('span', [item.text])
          ]),
          h('img', { class: 'profile-picture', src: item.fromUserId === userId ? otherUser.image : user.image })

        ]
        ]);
      },
      renderFooter: () => {
        return messageComposer.renderMaquette(); // set the message composer component in the footer
      }
    });
  };

export let destroyChatList = () => {
  messagesSubscription.unsubscribe();
  otherUserSubscription.unsubscribe();
};
