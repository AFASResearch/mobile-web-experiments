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
  oauth?: {
  };
}

export interface MessageInfo {
  id: string;
  chatRoomId: string; // format: see chat-page
  fromUserId: string;
  toUserId: string;
  text: string;
  // deprecated
  date: Date;
  timestamp: number;
}
