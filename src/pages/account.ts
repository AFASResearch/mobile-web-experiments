import {createPage} from '../components/page';
import {createText} from '../components/text';
import {createTextField} from '../components/text-field';
import {createButton} from '../components/button';
import {createImageUploader} from '../components/image-uploader';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
import {Projector} from 'maquette';

export let createAccountPage = (dataService: DataService, userService: UserService, projector: Projector) => {

  let {id, firstName, lastName, phoneNumber, image, company} = userService.getUserInfo();

  let doUpdate = () => {

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
    document.location.hash = '#users';
  };

  let page = createPage({
    title: 'Account',
    dataService,
    body: [
      createText({ htmlContent: 'About me' }),
      createTextField({ label: 'First name' }, { getValue: () => firstName, setValue: (value) => { firstName = value; } }),
      createTextField({ label: 'Last name' }, { getValue: () => lastName, setValue: (value) => { lastName = value; } }),
      createTextField({ label: 'phone number' }, { getValue: () => phoneNumber, setValue: (value) => { phoneNumber = value; } }),
      createTextField({ label: 'Company' }, { getValue: () => company, setValue: (value) => { company = value; } }),
      createImageUploader({ projector: projector, userService: userService }, {}),
      createButton({ text: 'Update', primary: true }, { onClick: doUpdate })
    ]
  });
  return page;
};
