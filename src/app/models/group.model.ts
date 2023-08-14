export interface Group {
  id: string;
  name: string;
  description: string;
  admins: string[];
  participants: string[];
  defaultTitle: number;
  titles: {
    id: number;
    content: string;
  }[];
  lessons: {};
}
