export interface Club {
  id: string;
  name: string;
  description: string;
  users: { users: string, rank: ClubRank }[];
  announcements: {};
  properties: {};
  payment: JSON;
  groups: {}
}

export interface Group {
  id: string;
  name: string;
  description: string;
  admins: string[];
  participants: string[];
  defaultTitle: number;
  titles: Titles[];
  lessons: {};
}

export interface Titles {
  id: number;
  content: string;
}

export enum ClubRank {
  OWNER = 'OWNER',
  COACH = 'COACH',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}
