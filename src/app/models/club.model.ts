export interface Club {
  id: string;
  name: string;
  description: string;
  users: { uuid: string, rank: ClubRank }[];
  defaultTitle: number;
  titles: Title[];
  // TODO: fix, it cannot be any
  lessons: any[];
  announcements: {};
  properties: {};
  payment: JSON;
  groups: Group[]
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
  teacherUuid: string;
  cancelled: boolean;
  payment: number;
  participants: LessonParticipant[];
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
}

export interface Title {
  id: number;
  content: string;
  duration: string;
}

export enum ClubRank {
  OWNER = 'OWNER',
  COACH = 'COACH',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}
