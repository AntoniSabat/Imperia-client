export interface Club {
  id: string;
  name: string;
  description: string;
  users: { users: string, rank: ClubRank };
  announcements: {};
  properties: {};
  payment: JSON;
  groups: {}
}

export enum ClubRank {
  OWNER = 'OWNER',
  COACH = 'COACH',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}
