import {h} from 'maquette';
import {createPage} from '../components/page/page';
import {createText} from '../components/text/text';
import {createTextField} from '../components/text-field/text-field';
import {createButton} from '../components/button/button';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';


export let createRegisterPage = (dataService: DataService, userService: UserService, id: string) => {
  let firstName = '';
  let lastName = '';
  let company = '';

  let doRegister = () => {
    userService.updateUserInfo({
      id,
      firstName,
      lastName,
      company
    })
  };

  let page = createPage({
    title: 'Registration',
    dataService,
    body: [
      createText({ htmlContent: 'How may we identify you?' }),
      createTextField({ label: 'First name' }, { getValue: () => firstName, setValue: (value) => { firstName = value } }),
      createTextField({ label: 'Last name' }, { getValue: () => lastName, setValue: (value) => { lastName = value } }),
      createTextField({ label: 'Company' }, { getValue: () => company, setValue: (value) => { company = value } }),
      createButton({ text: 'Register', primary: true }, { onClick: doRegister })
    ]
  })
  return page;
}
