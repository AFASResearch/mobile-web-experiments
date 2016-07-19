import {Projector, h} from 'maquette';
import {DataService} from '../services/data-service';
import {UserInfo} from '../interfaces';
import {createPage} from '../components/page/page';
import {createList} from '../components/list/list';

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
        { header: 'First Name', key: 'firstName' },
        { header: 'Last Name', key: 'lastName' },
        { header: 'Phone number', key: 'phoneNumber' },
        { header: 'Profile picture URL', key: 'imageUrl'},
        { header: 'Company', key: 'company' }
      ]
    },
    {
      getItems: () => users,
      getKey: (user: UserInfo) => user.id,
      renderCell: (item: UserInfo, columnKey: string) => {
        if (columnKey != 'phoneNumber') { 
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
      list
    ],
    destroy: () => {
      subscription.unsubscribe();
    }
  });

};
