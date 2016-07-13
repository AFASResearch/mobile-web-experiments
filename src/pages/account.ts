import {h} from 'maquette';
import {createPage} from '../components/page/page';
import {createText} from '../components/text/text';
import {createTextField} from '../components/text-field/text-field';
import {createButton} from '../components/button/button';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';


export let createAccountPage = (dataService: DataService, userService: UserService) => {

  let {id, firstName, lastName, company} = userService.getUserInfo();

  let doUpdate = () => {
    userService.updateUserInfo({
      id,
      firstName,
      lastName,
      company
    })
  };

  let page = createPage({
    title: 'Account',
    dataService,
    body: [
      createText({ htmlContent: 'About me' }),
      createTextField({ label: 'First name' }, { getValue: () => firstName, setValue: (value) => { firstName = value } }),
      createTextField({ label: 'Last name' }, { getValue: () => lastName, setValue: (value) => { lastName = value } }),
      createTextField({ label: 'Company' }, { getValue: () => company, setValue: (value) => { company = value } }),
      createButton({ text: 'Update', primary: true }, { onClick: doUpdate })
    ]
  })
  return page;
}
