import {UserType} from "../services/users.service";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  preferences: Preferences;
  profileImg: string;
  type: UserType;
  uuid: string;
  clubs: [];
  conversations: [];
}

export interface Preferences {
  announcementsNotifications: boolean;
  conversationsNotifications: boolean;
  darkMode: boolean;
  lessonsNotifications: boolean;
}

export interface DebtDetail {
  debtName: string;
  debtDate: string;
  debtAmount: number;
}
