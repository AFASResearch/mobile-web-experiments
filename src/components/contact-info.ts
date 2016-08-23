/*
* This component shows the user information of a user, and you can download the info to your contacts app.
* Downloading the contact as .vcf file does not work properly on Safari for OS X.
*/

import {h} from 'maquette';
import {UserInfo} from '../interfaces';
let vCard = <any>require('vcards-js');
let jstz = <any>require('jstz');
require('../styles/contact-info.scss');

vCard = vCard();

declare let navigator: any;

export interface ContactInfoConfig { };

export interface ContactInfoBindings {
  user: () => UserInfo;
};

export let createContactInfo = (config: ContactInfoConfig, bindings: ContactInfoBindings) => {
  let {user} = bindings;

  const timezone = jstz.determine(); // timezone library

  let downloadContact = (evt: Event) => {
    vCard.firstName = user().firstName;
    vCard.lastName = user().lastName;
    vCard.organization = user().company;

    // Set address information
    vCard.homeAddress.label = 'Home Address';
    vCard.homeAddress.street = user().address;
    vCard.homeAddress.city = user().city;
    vCard.homeAddress.countryRegion = user().country;

    // this piece of code creates a link (<a>) and emulates a click on it.
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
      return h('div', {class: 'contact-card-holder'}, user() ? [
        h('img', {class: 'profile-picture xlarge', src: user().image}, []),
        h('div', {class: 'contact-card-content'}, [
          h('h2', [`${user().firstName} ${user().lastName}`]),
          h('h3', [user().company]),
          h('h3', [timezone.name()]),
          h('a', { class: 'contact-info-link', key: 1, href: `tel:${user().phoneNumber}` }, ['Phone: ', user().phoneNumber]),
          h('a', { class: 'contact-info-link', key: 2, href: `callto:${user().skypeUserName}` }, ['Skype: ', user().skypeUserName]),
          h('a', { class: 'contact-info-link', key: 3, href: `https://maps.apple.com?q=${user().address},${user().city},${user().country}`},
          [`Location: ${user().address}, ${user().city}, ${user().country}`])
        ]),
        h('button', {class: 'button', onclick: downloadContact}, ['Save to contacts'])
      ] : h('div', ['nothing found']) );
    }
  };
};
