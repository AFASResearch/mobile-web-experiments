/*
This page shows an overview of the user itself,
The user info can be edited here.
*/

import {createPage} from '../components/page';
import {createTextField} from '../components/text-field';
import {createVoiceControlledTextField} from '../components/voice-controlled-text-field';
import {createButton} from '../components/button';
import {createImageUploader} from '../components/image-uploader';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
import {Projector} from 'maquette';
import {createText} from '../components/text';
import {createScroller} from '../components/scroller';

export let createAccountPage = (dataService: DataService, userService: UserService, projector: Projector) => {

  let {id, firstName, lastName, phoneNumber, image, company, address, country, city, skypeUserName} = userService.getUserInfo();

  let doUpdate = () => {
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    image = canvas.toDataURL();

    userService.updateUserInfo({
      id,
      firstName,
      lastName,
      phoneNumber,
      company,
      address,
      city,
      country,
      image,
      skypeUserName
    });
    document.location.hash = '#users';
  };

  let page = createPage({
    dataService,
    userService,
    projector,
    className: 'card',
    body: [
      createScroller([
        createVoiceControlledTextField({label: 'First name', projector: projector}, { getValue: () => firstName, setValue: (value) => {firstName = value; }}),
        createTextField({ label: 'Last name' }, { getValue: () => lastName, setValue: (value) => { lastName = value; } }),
        createTextField({ label: 'Phone number' }, { getValue: () => phoneNumber, setValue: (value) => { phoneNumber = value; } }),
        createTextField({ label: 'Skype name' }, { getValue: () => skypeUserName, setValue: (value) => { skypeUserName = value; } }),
        createTextField({ label: 'Company' }, { getValue: () => company, setValue: (value) => { company = value; } }),
        createTextField({ label: 'Address' }, { getValue: () => address, setValue: (value) => { address = value; } }),
        createTextField({ label: 'City' }, { getValue: () => city, setValue: (value) => { city = value; } }),
        createTextField({ label: 'Country' }, { getValue: () => country, setValue: (value) => { country = value; } }),
        createImageUploader({ projector: projector, userService: userService, image: image }, {}),
      ]),
      createButton({ text: 'Update', primary: true }, { onClick: doUpdate })
    ]
  }, { title: () => 'Account' });
  return page;
};
