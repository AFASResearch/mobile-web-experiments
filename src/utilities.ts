import {UserInfo} from './interfaces';

export let randomId = () => Math.random().toString(36).substr(2);

export let nameOfUser = (user: UserInfo) => {
  if (!user) {
    return '';
  }
  return `${user.firstName} ${user.lastName}`;
};

export let getFormattedDate = (date: Date) => {
  return date.toISOString().slice(0, 10);
};
