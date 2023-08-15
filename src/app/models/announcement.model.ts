export interface Announcement {
  type: ClubNewsType,
  recipents: string[],
  title: string,
  message: string,
}

export enum ClubNewsType {
  BROADCAST = 'BROADCAST',
  SELECTED = 'SELECTED'
}
