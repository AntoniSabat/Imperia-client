import { LessonStats, LessonType } from "./club.model";

export interface Lessons {
  clubId: string;
  id: string;
  start: number;
  end: number;
  type: LessonType;
  payment: number;
  stats: LessonStats;

  cols: number;
  pos: number;

  color: string;
  hours: string;
  
  colliders: Lessons[];
  nextColliders: Lessons[];
}
