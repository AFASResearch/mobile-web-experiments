/* this page shows an overview of all users in the database.
When they are click you will be redirect to a chat page */

import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {UserInfo, MessageInfo} from '../interfaces';
import {createPage} from '../components/page';
import {createList} from '../components/list';
import {createText} from '../components/text';

export let createUserListPage = (dataService: DataService, user: UserInfo, projector: Projector) => {

  let users: UserInfo[] = undefined;
  let usersCollection = dataService.horizon('users');

  let lastMessages: MessageInfo[] = [];

  let subscription = usersCollection.order('lastName').watch().subscribe((allUsers: UserInfo[]) => {
    users = allUsers;

    users.forEach((otheruser) => {
      let chatRoomId = [user.id, otheruser.id].sort().join('-'); // format: lowestUserId-highestUserId
      dataService.horizon('directMessages').findAll({ chatRoomId: chatRoomId }).order('timestamp', 'descending').limit(1).watch().subscribe((msg: any) => {
        if (msg[0]) {
          lastMessages.push(msg[0]);
        }
        projector.scheduleRender();
      });
    });

  });

  let list = createList({}, {
      getItems: () => users,
      getKey: (user: UserInfo) => user.id,
      renderRow: (item: UserInfo) => {

        let chatRoomId = [user.id, item.id].sort().join('-'); // format: lowestUserId-highestUserId

        let lastMessage: string;
        lastMessages.forEach((message) => {
          if (message.chatRoomId === chatRoomId) {
            lastMessage = message.text;
          }
        });

        return h('div', {class: 'row'},
        [ h('img', {class: 'profile-picture', src: item.image}),
        h('div', {class: 'messagecontainer'}, [
          h('b', [item.firstName, ' ', item.lastName]),
          h('p', [lastMessage])
        ])
      ]);

    },
    rowClicked: (item: UserInfo) => {
      let w = <any>window;
      w.location = `#chat/${item.id}` ;
    }
  });

  return createPage({
    title: 'Users',
    dataService,
    body: [
      createText({ htmlContent: 'Choose someone to chat with' }),
      list
    ],
    destroy: () => {
      subscription.unsubscribe();
    }
  });
};
