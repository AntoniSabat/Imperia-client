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

export enum LessonPresent {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  UNDEFINED = 'UNDEFINDED'
}

export interface LessonParticipant {
  uuid: string;
  status: LessonPresent;
  paid: number;
}

export interface LessonStats {
  title: string;
  teacher: string;
  cancelled: boolean;
  payment: number;

}

export enum LessonType {
  DEFAULT = "DEFAULT",
  EVENT = "EVENT"
}

export interface CalendarLesson {
  clubId: string;
  id: string;
  start: string;
  end: string;
  type: LessonType;
  payment: number;
  stats: LessonStats;
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
