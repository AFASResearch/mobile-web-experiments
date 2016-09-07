/*
New users will be redirected to this page and can fill in their credentials and upload/create a picture of themselves.
*/

import {createPage} from '../components/page';
import {createText} from '../components/text';
import {createTextField} from '../components/text-field';
import {createButton} from '../components/button';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
import {createImageUploader} from '../components/image-uploader';
import {getLocationData} from '../services/location-service';
import {Projector} from 'maquette';
import {createSimpleImageUploader} from '../components/simple-image-uploader';

export let createRegisterPage = (dataService: DataService, userService: UserService, projector: Projector, id: string) => {

  let firstName = '';
  let lastName = '';
  let company = '';
  let phoneNumber = '';
  let image: string = undefined;
  let skypeUserName = '';
  let address: string;
  let city: string;
  let country: string;

  let doRegister = () => {
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    image = canvas.toDataURL();

    userService.updateUserInfo({
      id,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      country,
      company,
      image,
      skypeUserName
    });
  };

  let page = createPage({
    dataService,
    userService,
    projector,
    className: 'card',
    body: [
      createText({ htmlContent: 'How may we identify you?' }),
      createTextField({ label: 'First name' }, { getValue: () => firstName, setValue: (value) => { firstName = value; } }),
      createTextField({ label: 'Last name' }, { getValue: () => lastName, setValue: (value) => { lastName = value; } }),
      createTextField({ label: 'Company' }, { getValue: () => company, setValue: (value) => { company = value; } }),

      createSimpleImageUploader({projector}, { getImage: () => image, setImage: (newImage: string) => {image = newImage;} }),
      createButton({ text: 'Register', primary: true }, { onClick: doRegister })
    ]
  }, {title: () => 'Registration' });
  return page;
};

