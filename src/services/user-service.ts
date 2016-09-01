import {UserInfo} from '../interfaces';

export interface UserService {
  initialize(): Promise<void>;
  initializeHorizon(horizon: any): void;
  updateUserInfo(newUserInfo: UserInfo): void;
  getUserInfo(): UserInfo;
}

export let createUserService = (store: any, scheduleRender: () => void): UserService => {
  let users: any;
  let userInfo: UserInfo;

  let updateUserInfo = (newUserInfo: UserInfo) => {
    users.upsert(newUserInfo).subscribe({
      error: (msg: Object) => { console.error(msg); },
      complete: () => {
        store.setItem('user-info', newUserInfo).then(() => {
          userInfo = newUserInfo;
          scheduleRender();
        });
      }
    });
  };

  return {
    initialize: () => {
      return store.getItem('user-info').then((info: UserInfo) => {
        userInfo = info;
      });
    },
    initializeHorizon: (horizon: any) => {
      users = horizon('users');
      // synchronize the userInfo with horizon in the background
      if (userInfo) {
        try {
          users.findAll({ id: userInfo.id }).fetch().subscribe(
            (serverInfo: UserInfo[]) => {
              if (serverInfo.length === 0) {
                // The server forgot about us, lets remind him who we are
                updateUserInfo(userInfo);
              } else {
                // The server may have updated info
                userInfo = serverInfo[0];
              }
            },
            (err: any) => {
              console.error(err);
            }
          );
        } catch(ex) {console.warn('probably offline', ex);}
      }
    },
    updateUserInfo,
    getUserInfo: () => userInfo
  };
};
