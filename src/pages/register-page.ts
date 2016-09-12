/*
New users will be redirected to this page and can fill in their credentials and upload/create a picture of themselves.
*/

import {createPage} from '../components/page';
import {createTextField} from '../components/text-field';
import {createButton} from '../components/button';
import {UserService} from '../services/user-service';
import {DataService} from '../services/data-service';
import {Projector, h} from 'maquette';
import {createSimpleImageUploader} from '../components/simple-image-uploader';
import {createScroller} from '../components/scroller';

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

  let companyField = createTextField(
    { label: 'Company' }, {
      getValue: () => company, setValue: (value) => {
        company = value;
      }
    }
  );
  let lastNameField = createTextField(
      { label: 'Last name' }, {
        getValue: () => lastName, setValue: (value) => {
          lastName = value;
        }
      }
    );

  let firstNameField = createTextField(
    { label: 'First name' }, {
      getValue: () => firstName, setValue: (value) => {
        firstName = value;
      }
    });


  let button = createButton({ text: 'Register', primary: true }, { onClick: doRegister });

  let imageField = createSimpleImageUploader(
    { projector }, {
      getImage: () => image, setImage: (newImage: string) => {
        image = newImage;
      }
    }
  );

  let page = createPage({
    dataService,
    userService,
    projector,
    className: 'card registerPage',
    body: [
      createScroller([
        {
          renderMaquette: () => h('div', [
            h('h1', {}, 'Register'),
            h(
            'div.register', [
              imageField.renderMaquette(),
              firstNameField.renderMaquette(),
              lastNameField.renderMaquette(),
              companyField.renderMaquette(),
              button.renderMaquette()
            ]
          )
          ])
        }
      ]),

    ]
  }, {title: () => 'Registration' });
  return page;
};

