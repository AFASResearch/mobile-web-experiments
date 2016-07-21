import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {UserInfo} from '../interfaces';
import {createPage} from '../components/page';
import {createList} from '../components/list';
import {createText} from '../components/text';

export let createUserListPage = (dataService: DataService, projector: Projector) => {

  let users: UserInfo[] = undefined;

  let usersCollection = dataService.horizon('users');

  let subscription = usersCollection.order('lastName').watch().subscribe((allUsers: UserInfo[]) => {
    users = allUsers;
    projector.scheduleRender();
  });

  let list = createList(
    {
      columns: [
        { header: 'Profile picture', key: 'image'},
        { header: 'First Name', key: 'firstName' },
        { header: 'Last Name', key: 'lastName' },
        { header: 'Phone number', key: 'phoneNumber' },
        { header: 'Company', key: 'company' }
      ]
    },
    {
      getItems: () => users,
      getKey: (user: UserInfo) => user.id,
      renderCell: (item: UserInfo, columnKey: string) => {
        if (columnKey == 'image') { 
          return h('img', { src: (item as any)[columnKey] ? (item as any)[columnKey] : 'images/default-profile-picture.png' , class: "profile-picture" }, [(item as any)[columnKey]]);
        } else if (columnKey != 'phoneNumber') {
          return h('a', { href: `#chat/${item.id}` }, [(item as any)[columnKey]]);
        } else { 
          return h('a', { href: `tel:` + (item as any)[columnKey] }, [(item as any)[columnKey]]);
        }
      }
    });

  return createPage({
    title: 'Users',
    dataService,
    body: [
      createText({htmlContent: "Choose someone to chat with"}),
      list
    ],
    destroy: () => {
      subscription.unsubscribe();
    }
  });

};
