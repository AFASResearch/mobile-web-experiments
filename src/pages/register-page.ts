import {h} from 'maquette';
import {createPage} from '../components/page/page';
import {createText} from '../components/text/text';
import {createTextField} from '../components/text-field/text-field';
import {createButton} from '../components/button/button';
import {UserInfo} from '../interfaces';

export let createRegisterPage = (updateUserInfo: (newUserInfo: UserInfo) => void, id: string) => {
  let firstName = 'Funny';
  let lastName = 'Crocodile';
  let company = '';

  let doRegister = () => {
    updateUserInfo({
      id,
      firstName,
      lastName,
      company
    })
  };

  let page = createPage({
    title: 'Registration',
    body: [
      createText({htmlContent: 'How may we identify you?'}),
      createTextField({label: 'First name'}, {getValue: () => firstName, setValue: (value) => {firstName = value}}),
      createTextField({label: 'Last name'}, {getValue: () => lastName, setValue: (value) => {lastName = value}}),
      createTextField({label: 'Company'}, {getValue: () => company, setValue: (value) => {company = value}}),
      createButton({text: 'Register', primary: true}, {onClick: doRegister})
    ]
  })
  return page;
}
