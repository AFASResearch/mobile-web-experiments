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
  fromUserId: string;
  toUserId: string;
  text: string;
  date: Date;
}

export interface Page extends Component {
  destroy?(): void;
}

export interface RouteRegistry {
  initializePage(route: string): Page; 
}
