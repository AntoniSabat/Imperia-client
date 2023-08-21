import {Injectable, OnInit} from '@angular/core';
import {Method, useFetch} from "../axios";
import {Announcement} from "../models/announcement.model";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";
import {environment} from "../../environments/environment";
import { Lessons } from '../models/lessons.model';
import {User} from "../models/user.model";
import {UsersService} from "./users.service";
import { CalendarLesson, Club, Group, Titles } from '../models/club.model';

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  activeClub! :Club;
  activeGroup!: Group;

  initialGroupValue: Group = {name: '', description: '', participants: [], titles: [], id: '', defaultTitle: -1, admins: [], lessons: []}
  initialClubValue: Club = {name: '', description: '', groups: [], id: '', users: [], announcements: [], payment: JSON, properties: {}}

  activeGroup$ = new BehaviorSubject<Group>(this.initialGroupValue);
  activeClub$ = new BehaviorSubject<Club>(this.initialClubValue);
  users$ = this.usersService.groupUsers$;
  clubs$: BehaviorSubject<Club[]> = new BehaviorSubject<Club[]>([]);
  groups$ = new BehaviorSubject<Group[]>([]);
  titles$ = new BehaviorSubject<Titles[]>([]);

  announcements$: BehaviorSubject<Announcement[]> = new BehaviorSubject<Announcement[]>([]);
  todayLessons$: BehaviorSubject<CalendarLesson[]> = new BehaviorSubject<CalendarLesson[]>([]);
  calendarLessons$: BehaviorSubject<Lessons[]> = new BehaviorSubject<Lessons[]>([]);

  constructor(private http: HttpClient, private usersService: UsersService) {}

  setActiveClub(data: Club) {
    this.activeClub = data;
  }
  getActiveClub() {
    return this.activeClub;
  }

  async createClub(name: string, description: string) {
    const auth = localStorage.getItem('auth');

    this.http.post<Club>( environment.apiBaseUrl + '/clubs/', {name, description}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.clubs$.next([...this.clubs$.getValue(), club]))
    ).subscribe();
  }

  async getClubInfo(id: string) {
    const { response, error } = await useFetch(Method.GET, 'clubs/' + id, {});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response?.data}
  }

  async loadClubs() {
    const auth = localStorage.getItem('auth');

    this.http.get<Club[]>( environment.apiBaseUrl + '/clubs/', {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((clubs: Club[]) => this.clubs$.next(clubs))
    ).subscribe();
  }

  loadActiveClub() {
    this.activeClub$.next(this.activeClub);
  }

  async joinClub(clubCode: string) {
    const auth = localStorage.getItem('auth');

    this.http.post<Club>( environment.apiBaseUrl + '/clubs/join', {clubCode}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.clubs$.next([...this.clubs$.getValue(), club]))
    ).subscribe();
  }

  setActiveGroup(data: Group) {
    this.activeGroup = data;
  }
  loadActiveGroup() {
    this.activeGroup$.next(this.activeGroup);
  }

  async loadGroups() {
    const auth = localStorage.getItem('auth');

    this.http.get<Group[]>(environment.apiBaseUrl + '/clubs/' + this.activeClub.id + '/allgroups', {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((groups: Group[]) => this.groups$.next(groups))
    ).subscribe();
  }

  async loadTodayLessons() {
    const auth = localStorage.getItem('auth');
    const today = new Date();

    this.http.get<CalendarLesson[]>(environment.apiBaseUrl + `/clubs/calendar/${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((data: CalendarLesson[]) => this.todayLessons$.next(data))
    ).subscribe()
  }

  async loadCalendarLessons(date: string) {
    const auth = localStorage.getItem('auth');

    this.http.get<CalendarLesson[]>(environment.apiBaseUrl + `/clubs/calendar/${date}`, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((data: CalendarLesson[]) => {
        const lessons: Lessons[] = [];
        data.forEach(obj => {
          const startY = parseInt(obj.start.substring(0, obj.start.indexOf(":"))) * 2 + (parseInt(obj.start.substring(obj.start.indexOf(":") + 1)) / 30);
          const endY = parseInt(obj.end.substring(0, obj.end.indexOf(":"))) * 2 + (parseInt(obj.end.substring(obj.start.indexOf(":") + 1)) / 30);
          lessons.push({
            clubId: obj.clubId,
            id: obj.id,
            start: startY,
            end: endY,
            type: obj.type,
            payment: obj.payment,
            stats: obj.stats,

            cols: 1,
            pos: 1,

            color: 'green',
            hours: `${obj.start} - ${obj.end}`,

            colliders: [],
            nextColliders: []
          });
        });

        lessons.sort((a, b) => a.start - b.start);

        lessons.forEach(lesson => {
          lesson.colliders = lessons.filter(obj => ((obj.start >= lesson.start && obj.start <= lesson.end && lesson !== obj) || (obj.end >= lesson.start && obj.end <= lesson.end && lesson !== obj)) || (obj.start < lesson.start && obj.end > lesson.end));
        });

        lessons.forEach(lesson => {
          const cols = Math.max(lesson.colliders.length, lesson.cols);
          lesson.colliders.forEach(collider => {
            if (collider.cols < cols)
              collider.cols = cols;
          })
          lesson.nextColliders = lessons.filter(obj => obj.start >= lesson.start && obj.start <= lesson.end && lesson !== obj && lesson.pos == obj.pos);
          lesson.nextColliders.forEach(obj => {
            obj.pos += 1;
          })
  
          while (true) {
            if (lessons.filter(obj => obj.end > lesson.start && obj.end < lesson.end && lesson !== obj && lesson.cols <= obj.cols).some(obj => obj.pos == lesson.pos)) {
              lesson.pos -= 1;
            } else {
              break;
            }
          }
        });

        lessons.sort((a, b) => a.pos - b.pos).reverse();

        lessons.forEach(lesson => {
          lesson.cols = lesson.pos;
        });

        lessons.forEach(lesson => {
          lesson.colliders.forEach(collider => {
            if (collider.cols < lesson.cols)
              collider.cols = lesson.cols;
          });
        });

        lessons.forEach(lesson => {
          lesson.colliders.forEach(collider => {
            if (collider.cols < lesson.cols)
              collider.cols = lesson.cols;
          });
        });

        this.calendarLessons$.next(lessons);
      })
    ).subscribe()

    console.log(this.calendarLessons$.getValue())
  }

  async createGroup(name: string, description: string) {
    console.log(name, description, this.activeClub.id)
    const auth = localStorage.getItem('auth');

    this.http.post<Group>(environment.apiBaseUrl + '/clubs/' + this.activeClub.id + '/groups/', {name, description },{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((group: Group) => this.groups$.next([...this.groups$.getValue(), group]))
    ).subscribe();
  }

  async updateGroupDefaultTitle(defaultTitle: number) {
    const auth = localStorage.getItem('auth');

    this.http.patch<Group[]>(environment.apiBaseUrl + '/clubs/' + this.activeClub.id + '/groups/' + this.activeGroup.id, { defaultTitle },{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((groups: Group[]) => this.groups$.next(groups))
    ).subscribe();
  }

  async addParticipantToGroup(participant: string) {
    const auth = localStorage.getItem('auth');

    this.http.post<User[]>(environment.apiBaseUrl + '/clubs/' + this.activeClub.id + '/groups/' + this.activeGroup.id + '/users', { clubId: this.activeClub$.getValue().id, groupId: this.activeGroup$.getValue().id, participant },{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((users: User[]) => this.users$.next(users))
    ).subscribe();
  }

  loadTitles() {
    const auth = localStorage.getItem('auth');

    this.http.get<Titles[]>(environment.apiBaseUrl + '/clubs/' + this.activeClub.id + '/groups/' + this.activeGroup.id + '/titles',{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((titles: Titles[]) => this.titles$.next(titles))
    ).subscribe();
  }

  addTitle(title: any) {
    const auth = localStorage.getItem('auth');

    this.http.post<Titles[]>(environment.apiBaseUrl + '/clubs/' + this.activeClub.id + '/groups/' + this.activeGroup.id + '/titles', {title}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((titles: Titles[]) => this.titles$.next(titles))
    ).subscribe();
  }

  async addAnnouncement(cludId: string, body: Announcement) {
    const auth = localStorage.getItem('auth');

    this.http.post<Announcement>( environment.apiBaseUrl + '/clubs/' + cludId + '/announcements', body,{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((announcement: Announcement) => this.announcements$.next([...this.announcements$.getValue(), announcement]))
    ).subscribe();
  }
}
