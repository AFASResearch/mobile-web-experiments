import {UserInfo} from './interfaces';
let moment = <any>require('moment');

export let randomId = () => Math.random().toString(36).substr(2);

export let nameOfUser = (user: UserInfo) => {
  if (!user) {
    return '';
  }
  return `${user.firstName} ${user.lastName}`;
};

export let getFormattedDate = (date: Date) => {
  return moment(date).format('YYYY-MM-DD HH:mm');
};
