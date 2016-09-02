/*
* This component shows the list of users, and the last message from each chat with these users.
*/

import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {sendNotification} from '../services/notification-service';
import {UserInfo, MessageInfo, NotificationInfo} from '../interfaces';
import {createList} from '../components/list';
import {getFormattedDate} from '../utilities';

let subscription: any;

export let createUserList = (dataService: DataService, user: UserInfo, projector: Projector, handleClick: (itemId: string) => void) => {

  let users: UserInfo[] = undefined;
  let usersCollection = dataService.horizon('users');
  let lastMessages: MessageInfo[] = [];

  try {
    subscription = usersCollection.order('lastName').watch().subscribe(
      (allUsers: UserInfo[]) => {
        users = allUsers;
        users.forEach(
          (otheruser) => {
            let chatRoomId: string = [user.id, otheruser.id].sort().join('-'); // format: lowestUserId-highestUserId

            dataService.horizon('directMessages').findAll({ chatRoomId: chatRoomId }).order('timestamp', 'descending').limit(1).watch().subscribe(
              (msg: any) => {

                if (msg[0]) {
                  lastMessages.push(msg[0]); // TODO: check if there was already an object for the current chatroom available and overwrite it.
                  lastMessages.sort((msg1, msg2) => msg1.timestamp - msg2.timestamp);

                  let lastmessage = lastMessages[lastMessages.length - 1];
                  let notification: NotificationInfo = { title: otheruser.firstName, body: lastmessage.text };
                  sendNotification(notification);
                }
                projector.scheduleRender();
              }
            );
          }
        );
      }
    );
  } catch(ex) {console.warn('probably offline', ex);}

  let list = createList({className: 'user-list'}, {
    getItems: () => users,
    getKey: (otherUser: UserInfo) => otherUser.id,
    renderRow: (item: UserInfo) => {

      // you need not chat with yourself.
      if (user.id === item.id) {
        return;
      }

      let chatRoomId = [user.id, item.id].sort().join('-'); // format: lowestUserId-highestUserId
      let lastMessage: MessageInfo;

      let lastMessageMustBeRead: boolean; 

      

      lastMessages.forEach((message) => {
        if (message.chatRoomId === chatRoomId) {
          lastMessage = message;

        if (!lastMessage.isRead) {
            let touserids = lastMessage.toUserId.split('-'); 
            let receiverid: string = '';
            if (touserids[0] === lastMessage.fromUserId) { 
              receiverid = touserids[1]; 
            } else { 
              receiverid = touserids[0];
            }
            lastMessageMustBeRead = receiverid === user.id;
           }
        }
      });

      return h('div', {class: 'row'}, [
        h('img', {class: 'profile-picture margin', src: item.image}),
        h('div', {class: 'userlistItemContainer'}, [
          h('div', { class: 'userlistItemTitleContainer'}, [
            h('h3', { class: 'userlistItemTitle'}, [item.firstName + ' ' + item.lastName]),
            h('span', {class: 'userlistItemTimeStamp'}, [lastMessage ? getFormattedDate(lastMessage.date) : undefined ])
          ]),
          lastMessage ?
          h('p', { class: 'userlistItemContent', styles: {'color': !lastMessageMustBeRead ? 'black' : 'green', 'font-weight': !lastMessageMustBeRead ? 'regular' : 'bold' } }, [ lastMessage.text ])
          : undefined
        ])
      ]);
    },
    rowClicked: (item: UserInfo) => {
      handleClick(item.id);
    }
  });
  return list;
};

export let destroyUserList = () => {
  if (subscription) {
    subscription.unsubscribe();
  }
};
