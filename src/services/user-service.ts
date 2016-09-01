import {UserInfo} from '../interfaces';

export interface UserService {
  initialize(): Promise<void>;
  initializeHorizon(horizon: any): void;
  initializeServiceWorker(serviceWorker: any): void;
  updateUserInfo(newUserInfo: UserInfo): void;
  getUserInfo(): UserInfo;
}

export let createUserService = (store: any, scheduleRender: () => void): UserService => {
  let users: any;
  let userInfo: UserInfo;
  let serviceWorker: any;
  let enablingPush = false;

  let enablePush = () => {
    if (!enablingPush && userInfo && !userInfo.pushEndpoint) {
      enablingPush = true;
      serviceWorker.pushManager.subscribe(
        {
          userVisibleOnly: true
        }
      ).then(
        function (sub: any) {
          console.log('push endpoint:', sub.endpoint);
          userInfo.pushEndpoint = sub.endpoint;
          updateUserInfo(userInfo);
        }
      );
    }
  };

  let updateUserInfo = (newUserInfo: UserInfo) => {
    users.upsert(newUserInfo).subscribe({
      error: (msg: Object) => { console.error(msg); },
      complete: () => {
        store.setItem('user-info', newUserInfo).then(() => {
          userInfo = newUserInfo;
          scheduleRender();
        });
        if (serviceWorker) {
          enablePush();
        }
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
                userInfo.pushEndpoint = undefined;
                updateUserInfo(userInfo);
              } else {
                // The server may have updated info
                userInfo = serverInfo[0];
              }
              if (serviceWorker) {
                enablePush();
              }
            },
            (err: any) => {
              console.error(err);
            }
          );
        } catch(ex) {console.warn('probably offline', ex);}
      }
    },
    initializeServiceWorker: (newServiceWorker: any) => {
      serviceWorker = newServiceWorker;
      if (userInfo) {
        enablePush();
      }
    },
    updateUserInfo,
    getUserInfo: () => userInfo
  };
};
