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
        { header: 'Profile picture', key: 'image' },
        { header: 'First Name', key: 'firstName' },
        { header: 'Last Name', key: 'lastName' },
        { header: 'Phone number', key: 'phoneNumber' },
        { header: 'Company', key: 'company' },
        { header: 'Addres', key: 'address' }
      ]
    },
    {
      getItems: () => users,
      getKey: (user: UserInfo) => user.id,
      renderRow: (item: UserInfo) => {
        console.log(item);
        return h('div', {class: 'row'},
        [ h('img', {class: 'profile-picture', src: item.image}),
          h('b', [item.firstName, ' ', item.lastName])
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
      createText({ htmlContent: '<h2>Choose someone to chat with</h2>' }),
      list
    ],
    destroy: () => {
      subscription.unsubscribe();
    }
  });
};
