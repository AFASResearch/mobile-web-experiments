import {UserInfo} from '../interfaces'
export interface UserService {
    initialize(): Promise<void>;
    updateUserInfo(newUserInfo: UserInfo): void;
    getUserInfo(): UserInfo;
}

export let createUserService = (horizon: any, store: LocalForage, scheduleRender: () => void): UserService => {
    let users = horizon('users');
    let userInfo: UserInfo;

    let updateUserInfo = (newUserInfo: UserInfo) => {
        users.upsert(newUserInfo).subscribe({
            error: (msg: Object) => { console.error(msg) },
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
        updateUserInfo,
        getUserInfo: () => userInfo
    };
};
