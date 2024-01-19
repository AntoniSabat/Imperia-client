export interface Club {
  _id: string;
  name: string;
  description: string;
  users: { uuid: string, rank: ClubRank }[];
  calendarLessons: CalendarLesson[];
  templateLessons: TemplateLesson[];
  announcements: Announcement[];
  properties: {};
  stripe: {};
}

export enum ClubRank {
  OWNER = 'OWNER',
  COACH = 'COACH',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

export interface CalendarLesson {
  id: string;
  start: {
    hour: number;
    minute: number;
    day: number;
    month: number;
    year: number;
  };
  end: {
    hour: number;
    minute: number;
    day: number;
    month: number;
    year: number;
  };
  type: LessonType;
  stats: {
    title: string;
    coachId: string;
    cancelled: boolean;
    cancelledReason: string;
    participants: {
      uuid: string;
      status: LessonPresent;
    }[];
  }
}

export interface TemplateLesson {
  id: string;
  name: string;
  defaultTitleId: string;
  titles: {
    id: string;
    name: string;
    duration: number; // in minutes
  }[];
  description: string;
  coaches: string[];
  participants: string[];
}

export interface Announcement {

}

export enum LessonType {
  DEFAULT = "DEFAULT",
  EVENT = "EVENT"
}

export enum LessonPresent {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  UNDEFINED = 'UNDEFINDED'
}
