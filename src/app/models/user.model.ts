import { UserType } from "../services/users.service";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  preferences: {
    darkMode: Boolean;
    conversationsNotifications: Boolean;
    lessonsNotifications: Boolean;
    announcementsNotifications: Boolean;
  };
  profileImage: string;
  type: UserType;
  uuid: string;
  clubs: [];
  conversations: [];
}

export interface Preferences {
  darkMode: Boolean;
  conversationsNotifications: Boolean;
  lessonsNotifications: Boolean;
  announcementsNotifications: Boolean;
}

export interface DebtDetail {
  debtName: string;
  debtDate: string;
  debtAmount: number;
}
