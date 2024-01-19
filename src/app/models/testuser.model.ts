export enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  preferences: Preferences;
  profileImage: string;
  type: UserType;
  clubs: string[];
  conversations: string[];
}

export interface Preferences {
  darkMode: Boolean;
  conversationsNotifications: Boolean;
  lessonsNotifications: Boolean;
  announcementsNotifications: Boolean;
}
