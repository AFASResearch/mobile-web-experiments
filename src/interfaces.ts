export interface MessageInfo {
  id: string;
  chatRoomId: string; // format: see chat-page
  fromUserId: string;
  toUserId: string;
  text: string;
  date: Date;
  timestamp: number;
  isRead?: boolean;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  image: string;
  company?: string;
  skypeUserName?: string;
  oauth?: { };
  pushEndpoint?: string;
}

export interface NotificationInfo {
  title: string;
  body: string;
}
