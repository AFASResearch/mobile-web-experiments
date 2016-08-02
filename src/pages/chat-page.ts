import {Projector, h} from 'maquette';
import {createList} from '../components/list';
import {DataService} from '../services/data-service';
import {createPage} from '../components/page';
import {createText} from '../components/text';
import {createMessageComposer} from '../components/message-composer';
import {UserInfo, MessageInfo} from '../interfaces';
import {nameOfUser, randomId} from '../utilities';
let jstz = <any>require('jstz');

export let createChatPage = (dataService: DataService, user: UserInfo, toUserId: string, projector: Projector) => {

  const timezone = jstz.determine();

  let otherUser: UserInfo;
  let messages: MessageInfo[];
  let chatRoomId = [user.id, toUserId].sort().join('-'); // format: lowestUserId-highestUserId

  let otherUserSubscription = dataService.horizon('users').find(toUserId).watch().subscribe((userInfo: UserInfo) => {
    otherUser = userInfo;
    projector.scheduleRender();
  });

  let longitude: number;
  let latitude: number;

  let getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function showPosition(position) {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
        projector.scheduleRender();
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };
  getLocation();

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
    renderRow: (item: MessageInfo) => {
      return h('div', { class: 'row' }, [
        h('img', { class: 'profile-picture', src: item.fromUserId === toUserId ? otherUser.image : user.image }),
        h('div', { class: 'messagecontainer' }, [
          h('b', [item.fromUserId === toUserId ? otherUser.firstName : 'me']),
          h('span', [item.text]),
          h('small', [item.date.toISOString().slice(0, 10)])
        ])
      ]);
    }
  });

  let timeZoneText = createText({ htmlContent: 'Current timezone: ' + timezone.name() });

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
      {
        renderMaquette: () => {
          // code for retrieving current location
          // let link = `http://maps.apple.com/maps?z=12&t=m&q=loc:${latitude}+${longitude}`;
          // return h('a', {href: link}, [link]);
          return h('div', otherUser ? [
            h('h1', ['Chat with ' + nameOfUser(otherUser)]),
            h('h2', ['company: ', otherUser.company]),
            h('a', { key: 1, href: `tel: ${otherUser.phoneNumber}` }, ['phone: ', otherUser.phoneNumber]),
            h('a', { key: 2, href: `http://maps.apple.com?q=${otherUser.address},${otherUser.city},${otherUser.country}`},
            [`${otherUser.address},${otherUser.city},${otherUser.country}`])
          ] : undefined
          );
        }
      },
      timeZoneText,
      list,
      messageComposer
    ],
    destroy: () => {
      otherUserSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    }
  });
};
