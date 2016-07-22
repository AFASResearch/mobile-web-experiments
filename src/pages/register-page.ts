import {createPage} from '../components/page';
import {createText} from '../components/text';
import {createTextField} from '../components/text-field';
import {createButton} from '../components/button';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
import {createImageUploader} from '../components/image-uploader';
import {Projector} from 'maquette';

export let createRegisterPage = (dataService: DataService, userService: UserService, projector: Projector, id: string) => {
  let firstName = '';
  let lastName = '';
  let company = '';
  let phoneNumber = '';
  let image = '';

  let doRegister = () => {

    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    image = canvas.toDataURL();

    userService.updateUserInfo({
      id,
      firstName,
      lastName,
      phoneNumber,
      company,
      image
    });
  };

  let page = createPage({
    title: 'Registration',
    dataService,
    body: [
      createText({ htmlContent: 'How may we identify you?' }),
      createTextField({ label: 'First name' }, { getValue: () => firstName, setValue: (value) => { firstName = value; } }),
      createTextField({ label: 'Last name' }, { getValue: () => lastName, setValue: (value) => { lastName = value; } }),
      createTextField({ label: 'Phone number' }, { getValue: () => phoneNumber, setValue: (value) => { phoneNumber = value; } }),
      createTextField({ label: 'Company' }, { getValue: () => company, setValue: (value) => { company = value; } }),
      createImageUploader({ projector: projector, userService: userService }, {}),
      createButton({ text: 'Register', primary: true }, { onClick: doRegister })
    ]
  });
  return page;
};
