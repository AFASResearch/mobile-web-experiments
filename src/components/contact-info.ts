import {h} from 'maquette';
import {UserInfo} from '../interfaces';
let vCard = <any>require('vcards-js');

require('../styles/text.scss');

export interface ContactInfoConfig {
}

export interface ContactInfoBindings {
  user: () => UserInfo;
}

export let createContactInfo = (config: ContactInfoConfig, bindings: ContactInfoBindings) => {
  let {user} = bindings;

    vCard = new vCard();

    let downloadContact = (evt: Event) => {

      // Set properties
      vCard.firstName = user().firstName;
      vCard.lastName = user().lastName;
      vCard.organization = user().company;

      // Set address information
      vCard.homeAddress.label = 'Home Address';
      vCard.homeAddress.street = user().address;
      vCard.homeAddress.city = user().city;
      vCard.homeAddress.countryRegion = user().country;

      // this piece of code creates a link (<a>) and emulates click on it.
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/vcard;charset=utf-16B,' + encodeURIComponent(vCard.getFormattedString()));
      element.setAttribute('download', `${user().firstName}.vcf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

  return {
    renderMaquette: () => {

      return h('div', {class: 'contact-card'}, user() ? [
        h('img', {class: 'profile-picture', src: user().image}, []),
        h('div', {class: 'contact-card-content'}, [
          h('h4', ['Chat with ' + `${user().firstName} ${user().lastName}`]),
          h('h5', ['company: ', user().company]),
          h('ul', [
            h('li', [ h('a', { key: 1, href: `tel: ${user().phoneNumber}` }, ['Phone:', user().phoneNumber]) ]),
            h('li', [ h('a', { key: 2, href: `https://maps.apple.com?q=${user().address},${user().city},${user().country}`},
            [`Location: ${user().address}, ${user().city}, ${user().country}`]) ])
          ])
        ]),
        h('button', {class: 'button', onclick: downloadContact}, ['Save'])
      ] : h('div', ['nothing found']) );
    }
  };
};
