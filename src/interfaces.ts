export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  oauth?: {
  }
}

export interface MessageInfo {
  fromUserId: string;
  toUserId: string;
  text: string;
  date: Date;
}
