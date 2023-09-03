import {Injectable} from '@angular/core';
import {Method, useFetch} from "../axios";
import {Announcement} from "../models/announcement.model";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";
import {environment} from "../../environments/environment";
import { Lessons } from '../models/lessons.model';
import {UsersService} from "./users.service";
import {CalendarLesson, Club, ClubRank, Group,} from '../models/club.model';
import {group} from "@angular/animations";

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  initialClubValue: Club = {name: '', description: '', groups: [], defaulTitle: -1, titles: [], id: '', users: [], announcements: [], payment: JSON, properties: {}}
  initialGroupValue: Group = {id: '', name: '', description: '', admins: [], participants: [], lessons: []};

  activeGroup$ = new BehaviorSubject<string>('');
  activeClub$ = new BehaviorSubject<Club>(this.initialClubValue);
  usersData$ = this.usersService.usersData$;
  // groupUuids$ = new BehaviorSubject<string[]>([]);
  clubs$: BehaviorSubject<Club[]> = new BehaviorSubject<Club[]>([]);
  // groups$ = new BehaviorSubject<Group[]>([]);
  // titles$ = new BehaviorSubject<any[]>([]);

  announcements$: BehaviorSubject<Announcement[]> = new BehaviorSubject<Announcement[]>([]);
  todayLessons$: BehaviorSubject<CalendarLesson[]> = new BehaviorSubject<CalendarLesson[]>([]);
  calendarLessons$: BehaviorSubject<Lessons[]> = new BehaviorSubject<Lessons[]>([]);
  user$ = this.usersService.user$;

  constructor(private http: HttpClient, private usersService: UsersService) {}

  async setActiveClub(club: Club) {
    this.activeClub$.next(club);
    this.activeGroup$.next('');
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

  async loadGroupsForActiveClub() {
    const auth = localStorage.getItem('auth');
    const rank = this.activeClub$.getValue().users.find(user => user.uuid == this.user$.getValue().uuid)?.rank;

    this.http.get<Group[]>(environment.apiBaseUrl + `/clubs/${this.activeClub$.getValue().id}/${rank == ClubRank.OWNER || rank == ClubRank.COACH ? 'groups' : 'groupsforuser'}`, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((groups: Group[]) => {
        const club = this.activeClub$.getValue();
        club.groups = groups;

        this.activeClub$.next(club);
      })
    ).subscribe();
  }

  async loadClubs() {
    const auth = localStorage.getItem('auth');

    this.http.get<Club[]>(environment.apiBaseUrl + '/clubs/', {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((clubs: Club[]) => this.clubs$.next(clubs))
    ).subscribe();
  }


  async joinClub(clubCode: string) {
    const auth = localStorage.getItem('auth');

    this.http.post<Club>( environment.apiBaseUrl + '/clubs/join', {clubCode}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.clubs$.next([...this.clubs$.getValue(), club]))
    ).subscribe();
  }

  setActiveGroup(id: string) {
    this.activeGroup$.next(id);
  }

  // async loadGroups() {
  //   const auth = localStorage.getItem('auth');
  //
  //   this.http.get<Group[]>(environment.apiBaseUrl + '/clubs/' + this.activeClub$.getValue().id + '/allgroups', {
  //     headers: auth ? {Authorization: `Bearer ${auth}`} : {}
  //   }).pipe(
  //     tap((groups: Group[]) => this.groups$.next(groups))
  //   ).subscribe();
  // }

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
  }

  async createGroup(name: string, description: string) {
    const auth = localStorage.getItem('auth');

    this.http.post<Club>(environment.apiBaseUrl + '/clubs/' + this.activeClub$.getValue().id + '/groups/', {name, description},{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.activeClub$.next(club))
    ).subscribe();
  }

  // async addParticipantToGroup(participant: string) {
  //   const auth = localStorage.getItem('auth');
  //
  //   this.http.post<User[]>(environment.apiBaseUrl + '/clubs/' + this.activeClub$.getValue().id + '/groups/' + this.activeGroup$.getValue() + '/users', { clubId: this.activeClub$.getValue().id, groupId: this.activeGroup$.getValue(), participant },{
  //     headers: auth ? {Authorization: `Bearer ${auth}`} : {}
  //   }).pipe(
  //     tap((users: User[]) => {
  //       this.groupUuids$.next(users.map((user: User) => user.uuid));
  //     })
  //   ).subscribe();
  // }

  // loadTitles() {
  //   const auth = localStorage.getItem('auth');
  //
  //   this.http.get<any[]>(environment.apiBaseUrl + '/clubs/' + this.activeClub$.getValue().id + '/groups/' + this.activeGroup$.getValue() + '/titles',{
  //     headers: auth ? {Authorization: `Bearer ${auth}`} : {}
  //   }).pipe(
  //     tap((titles: any[]) => this.titles$.next(titles))
  //   ).subscribe();
  // }

  // addTitle(title: string | number | null | undefined) {
  //   const auth = localStorage.getItem('auth');
  //
  //   this.http.post<Title[]>(environment.apiBaseUrl + '/clubs/' + this.activeClub$.getValue().id + '/groups/' + this.activeGroup$.getValue() + '/titles', {title}, {
  //     headers: auth ? {Authorization: `Bearer ${auth}`} : {}
  //   }).pipe(
  //     tap((titles: Title[]) => this.titles$.next(titles))
  //   ).subscribe();
  // }

  getGroup(id: string) : Group {
    return this.activeClub$.getValue().groups.find(group => group.id == id) ?? this.initialGroupValue;
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
