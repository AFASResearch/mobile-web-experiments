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

export let createMorePage = (dataService: DataService, userService: UserService, projector: Projector) => {

  let userInfo = userService.getUserInfo();

  let firstName = userInfo.firstName;
  let lastName = userInfo.lastName;
  let company = userInfo.company;
  let phoneNumber = userInfo.phoneNumber;
  let image = userInfo.image;
  let skypeUserName = userInfo.skypeUserName;
  let address = 'pending...';
  let city = 'pending...';
  let country = 'pending...';

  let doRegister = () => {
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    image = canvas.toDataURL();

    userService.updateUserInfo({
      id: userInfo.id,
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

  getLocationData().then((locationdata: any) => {
    address = `${locationdata.street} ${locationdata.streetnumber}`;
    city = locationdata.city;
    country = locationdata.country;
    projector.scheduleRender();
  });

  let page = createPage({
    dataService,
    userService,
    projector,
    className: 'card',
    body: [
      createText({ htmlContent: 'How may we identify you?' }),
      createTextField({ label: 'First name' }, { getValue: () => firstName, setValue: (value) => { firstName = value; } }),
      createTextField({ label: 'Last name' }, { getValue: () => lastName, setValue: (value) => { lastName = value; } }),
      createTextField({ label: 'Phone number' }, { getValue: () => phoneNumber, setValue: (value) => { phoneNumber = value; } }),
      createTextField({ label: 'Skype name' }, { getValue: () => skypeUserName, setValue: (value) => { skypeUserName = value; } }),
      createTextField({ label: 'Company' }, { getValue: () => company, setValue: (value) => { company = value; } }),

      // these fields will be prefilled automatically since we estimate the location of the user
      createTextField({ label: 'Address', prefilled: true}, { getValue: () => address, setValue: (value) => { address = value; }}),
      createTextField({ label: 'City', prefilled: true}, { getValue: () => city, setValue: (value) => { city = value; }}),
      createTextField({ label: 'Country', prefilled: true}, { getValue: () => country, setValue: (value) => { country = value; }}),

      createImageUploader({ projector: projector, userService: userService, image: 'images/barcode.jpg' }, {}),
      createButton({ text: 'Register', primary: true }, { onClick: doRegister })
    ]
  }, {title: () => 'More' });
  return page;
};
