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
import {getFormattedDateSmall, randomId} from '../utilities';
import {createModal} from './modal';
import {createContactInfo} from './contact-info';

require('../styles/contact-info.scss');
require('../styles/list.scss');

let otherUserSubscription: any;
let messagesSubscription: any;

let modalIsOpen = false;

export interface ChatListConfig {
  dataService: DataService;
  user: UserInfo;
  projector: Projector;
}

export interface ChatListBindings {
  toUserId?: () => string;
  getOtherUser?: (otheruser: UserInfo) => void;
}

export let createChatList = (config: ChatListConfig, bindings: ChatListBindings) => {
  let {dataService, user, projector} = config;
  let {toUserId, getOtherUser} = bindings;

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
        if (getOtherUser) {
          getOtherUser(userInfo);
        }
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
      .order('timestamp', 'ascending')
      .limit(500)
      .watch()
      .subscribe((msgs: MessageInfo[]) => {
        projector.scheduleRender();
        messages = [];
        // if there is a new message, append it and sort the array
        if (msgs.length > 0) {
          msgs.sort((msg1, msg2) => msg1.timestamp - msg2.timestamp);
          messages = [];
          for (let i = 0; i < msgs.length - 1; i++) {
            if (msgs[i].id !== msgs[i + 1].id) {
              messages.push(msgs[i]);
            }
          }
          messages.push(msgs[msgs.length - 1]); // also push the last message
          messages.forEach((msg: MessageInfo) => {
            if (!msg.isRead) {
              if (msg.toUserId === user.id) {
                setTimeout(() => {
                  msg.isRead = true;
                  dataService.horizon('directMessages').update(msg);
                  console.log('currently uploading to isRead', msg.text);
                }, 500);
              }
            }
          });
        }
      });
    };

    let sendMessage = (text: string) => {
      let date = new Date();
      let message: MessageInfo = {
        id: randomId(),
        chatRoomId: chatRoomId, // format: see chat-page
        fromUserId: user.id,
        toUserId: toUserId(),
        text: text,
        date: date,
        timestamp: date.valueOf(),
        isRead: false
      };
      dataService.horizon('directMessages').upsert(message);
    };

    let toggleModal = () => {
      modalIsOpen = !modalIsOpen;
    };

    // run these functions for the first time
    updateChatRoomId();
    try {
      updateOtherUserSubscription();
      updateMessagesSubscription();
    } catch(ex) {console.warn('probably offline', ex);}

    let messageComposer = createMessageComposer({ projector}, { sendMessage });
    let contactInfo = createContactInfo({}, {user: () => otherUser});

    return createList({className: 'chat-list'}, {
      getItems: () => messages,
      getKey: (message: MessageInfo) => message.id,
      renderHeader: () => {

        let modal = createModal({
          isOpen: modalIsOpen,
          title: 'modal',
          contents: [
            contactInfo
          ]
        }, {
          toggleModal: toggleModal
        });

        return h('div', [
          modal.renderMaquette()
        ]);
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

        if (item.fromUserId === userId) {

          return h('div', { class: 'chatrow', classes: {right: false}, afterCreate: scrollpage }, [
            otherUser ? [
            h('img', { class: 'profile-picture', src: item.fromUserId === userId ? otherUser.image : user.image, onclick: item.fromUserId === userId ? toggleModal : undefined }),
            h('div', {key: item, class: 'messagecontainer' }, [
              h('div', { class: 'messageTitleContainer'}, [
                h('b', [
                  otherUser.firstName,
                ]),
                h('span', {class: 'messageTimeStamp'}, [getFormattedDateSmall(item.date)])
              ]),
              h('span', [item.text])
            ]) ] : undefined
          ]);
        } else {
          return h('div', { class: 'chatrow', classes: {right: true}, afterCreate: scrollpage }, [
          h('div', {key: item, class: 'messagecontainer' }, [
            h('div', { class: 'messageTitleContainer'}, [
              h('b', [
                'me',
//              item.isRead ? '✓' : ''
              ]),
              h('span', {class: 'messageTimeStamp'}, [getFormattedDateSmall(item.date)])
            ]),
            h('span', [item.text])
          ]),
          h('img', { class: 'profile-picture', src: item.fromUserId === userId ? otherUser.image : user.image })
          ]);
        }
      },
      renderFooter: () => {
        return messageComposer.renderMaquette(); // set the message composer component in the footer
      }
    });
  };

export let destroyChatList = () => {
  if (messagesSubscription) {
    messagesSubscription.unsubscribe();
  }
  if (otherUserSubscription) {
    otherUserSubscription.unsubscribe();
  }
};
