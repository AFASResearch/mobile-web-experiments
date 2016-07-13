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

  let list = createList({
    columns: [
      { header: 'First Name', key: 'firstName' },
      { header: 'Last Name', key: 'lastName' },
      { header: 'Company', key: 'company' }
    ]
  }, {
      getItems: () => users,
      getKey: (user: UserInfo) => user.id,
      renderCell: (item: UserInfo, columnKey: string) => {
        return h('a', { href: `#chat/${item.id}` }, [(item as any)[columnKey]]);
      }
    });
  let page = createPage({
    title: 'Users',
    dataService,
    body: [
      list
    ]
  });

  return {
    renderMaquette: page.renderMaquette,
    destroy: () => {
      subscription.unsubscribe();
    }
  }
};
