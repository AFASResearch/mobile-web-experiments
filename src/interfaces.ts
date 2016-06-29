import {Component} from 'maquette';

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  oauth?: {
  }
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

export interface Page extends Component {
  destroy?(): void;
}

export interface RouteRegistry {
  initializePage(route: string): Page; 
}
