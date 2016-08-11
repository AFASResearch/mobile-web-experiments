import {Projector, h} from 'maquette';
import {createList} from '../components/list';
import {DataService} from '../services/data-service';
import {UserInfo, MessageInfo} from '../interfaces';
import {getFormattedDate, randomId} from '../utilities';
import {createMessageComposer} from '../components/message-composer';
import {createContactInfo} from '../components/contact-info';

require('../styles/chat-list.scss');

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
        if (msgs.length > 0) {
          projector.scheduleRender();
          messages = msgs.sort((msg1, msg2) => msg1.timestamp - msg2.timestamp);

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

      },
      (err: Error) => {
        // on error
        console.error(err);
      },
      () => {
        // on complete
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
    let contactInfo = createContactInfo({}, {user: () => otherUser});

    let list = createList({className: 'chat-list'}, {
      getItems: () => messages,
      getKey: (message: MessageInfo) => message.id,
      renderHeader: () => {
        if (contactInfo) {
          return contactInfo.renderMaquette();
        } else {
          return undefined;
        }
      },
      renderRow: (item: MessageInfo) => {
        let userId = toUserId();

        // if the user id of the other user has changed...
        if (userId !== oldUserId) {
          updateChatRoomId();
          updateOtherUserSubscription();
          updateMessagesSubscription();
          oldUserId = userId;
        }

        return h('div', { class: 'row', afterCreate: scrollpage }, [
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
