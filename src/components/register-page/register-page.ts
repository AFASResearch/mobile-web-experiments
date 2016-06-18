import {h} from 'maquette';
import {createPage} from '../page/page';
import {createText} from '../text/text';
import {createTextField} from '../text-field/text-field';
import {createButton} from '../button/button';
import {UserInfo} from '../../interfaces';

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
