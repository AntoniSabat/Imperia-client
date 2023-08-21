import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Lesson} from "../../models/lesson.model";
import {Lessons} from "../../models/lessons.model";
import { ClubsService } from 'src/app/services/clubs.service';
import { CalendarLesson } from 'src/app/models/club.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  times: string[] = [];
  lessons$ = this.clubsService.calendarLessons$;

  constructor(private clubsService: ClubsService) { }

  ngOnInit() {
    this.generateTimes();
    this.generateDates();
    const today = new Date();
    this.clubsService.loadCalendarLessons(`${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`);


    // this.creatingLessons(`${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`)
    // this.lessonsType = this.changeDisplay(this.lessons,'L'); // lekcja
    // this.trainingsType = this.changeDisplay(this.lessons,'T'); // trening
    // this.groupsType = this.changeDisplay(this.lessons,'S'); // szkolenie
    // this.chooseType('L');
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

  changeDisplay(lessons: Lessons[], type: string) {
    lessons = this.lessons.filter(lesson => lesson.type === type);
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
