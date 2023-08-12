import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Lesson} from "../../models/lesson.model";
import {Lessons} from "../../models/lessons.model";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  times: string[] = [];

  constructor() { }

  ngOnInit() {
    this.generateTimes();
    this.generateDates();

    this.creatingLessons()
    this.lessonsType = this.changeDisplay(this.lessons,'L');
    this.trainingsType = this.changeDisplay(this.lessons,'T');
    this.groupsType = this.changeDisplay(this.lessons,'S');
    this.chooseType('L');
  }

  generateTimes() {
    for (let hour = 0; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourString = hour.toString().padStart(2, '0');
        const minuteString = minute.toString().padStart(2, '0');
        const time = `${hourString}:${minuteString}`;
        this.times.push(time);
      }
    }
  }


  days: string[] = ['P', 'W', 'S', 'C', 'P', 'S', 'N'];
  dates: string[] = [];

  data = [
    {
      title: "Lekcja",
      id: "blah blah blah",
      color: "#071952",
      start: "02:30",
      end: "03:15",
      type: 'L'
    },
    {
      title: "Lekcja",
      id: "blah2 blah2 blah2",
      color: "#071952",
      start: "03:30",
      end: "04:15",
      type: 'L'
    },
    {
      title: "Lekcja",
      id: "blah2 blah2 blah2",
      color: "#071952",
      start: "05:30",
      end: "06:15",
      type: 'L'
    },
    {
      title: "Szkolenie",
      id: "blah blah blah",
      color: "#FF8600",
      start: "02:45",
      end: "03:50",
      type: 'S'
    },
    {
      title: "Szkolenie",
      id: "blah2 blah2 blah2",
      color: "#FF8600",
      start: "02:00",
      end: "04:45",
      type: 'S'
    },
  ]

  generateDates() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(monday.getDate() - (today.getDay() - 1));

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(date.getDate() + i);
      const dateString = this.formatDate(date);
      this.dates.push(dateString);
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    return String(day);
  }

  @ViewChild('lesson') lesson!: ElementRef;
  lessons: Lessons[] = [];
  selectedLessons: Lessons[] = [];
  lessonsType: Lessons[] = [];
  trainingsType: Lessons[] = [];
  groupsType: Lessons[] = [];


  creatingLessons() {
    this.data.forEach(obj => {
      const startY = parseInt(obj.start.substring(0, obj.start.indexOf(":"))) * 2 + (parseInt(obj.start.substring(obj.start.indexOf(":") + 1)) / 30);
      const endY = parseInt(obj.end.substring(0, obj.end.indexOf(":"))) * 2 + (parseInt(obj.end.substring(obj.start.indexOf(":") + 1)) / 30)
      this.lessons.push({
        cols: 1,
        pos: 1,
        color: obj.color,
        start: startY,
        end: endY,
        title: obj.title,
        hours: `${obj.start} - ${obj.end}`,
        colliders: [],
        nextColliders: [],
        type: obj.type
      })
    })
  }

  formatLessons = () => {
    this.lessons.sort((a, b) => a.start - b.start);

    this.lessons.forEach(lesson => {
      lesson.colliders = this.lessons.filter(obj => ((obj.start >= lesson.start && obj.start <= lesson.end && lesson !== obj) || (obj.end >= lesson.start && obj.end <= lesson.end && lesson !== obj)) || (obj.start < lesson.start && obj.end > lesson.end))
    });

    this.lessons.forEach(lesson => {
    });

    this.lessons.forEach(lesson => {
      const cols = Math.max(lesson.colliders.length, lesson.cols);
      lesson.colliders.forEach(collider => {
        if (collider.cols < cols)
          collider.cols = cols;
      })

      lesson.nextColliders = this.lessons.filter(obj => obj.start >= lesson.start && obj.start <= lesson.end && lesson !== obj && lesson.pos == obj.pos)
      lesson.nextColliders.forEach(obj => {
        obj.pos += 1;
      })

      while (true) {
        if (this.lessons.filter(obj => obj.end > lesson.start && obj.end < lesson.end && lesson !== obj && lesson.cols <= obj.cols).some(obj => obj.pos == lesson.pos)) {
          lesson.pos -= 1;
        } else {
          break;
        }
      }
    })

    this.lessons.sort((a, b) => a.pos - b.pos).reverse();

    this.lessons.forEach(lesson => {
      lesson.cols = lesson.pos;
    });

    this.lessons.forEach(lesson => {
      lesson.colliders.forEach(collider => {
        if (collider.cols < lesson.cols) {
          collider.cols = lesson.cols;
        }
      });
    });

    this.lessons.forEach(lesson => {
      lesson.colliders.forEach(collider => {
        if (collider.cols < lesson.cols) {
          collider.cols = lesson.cols;
        }
      });
    });

    this.lessons.forEach(lesson => {
      lesson.colliders = [];
      lesson.nextColliders = [];
    });
  }

  changeDisplay(lessons: Lessons[], type: string) {
    lessons = this.lessons.filter(lesson => lesson.type === type);
    this.formatLessons();
    return lessons;
  }

  chooseType(type: string) {
    if (type === 'L')
      this.selectedLessons = this.lessonsType;
    else if (type === 'T')
      this.selectedLessons = this.trainingsType;
    else
      this.selectedLessons = this.groupsType;
  }
}
