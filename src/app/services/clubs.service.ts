import {Injectable} from '@angular/core';
import {Method, useFetch} from "../axios";
import {Announcement} from "../models/announcement.model";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";
import {environment} from "../../environments/environment";
import { Lessons } from '../models/lessons.model';
import {UsersService} from "./users.service";
import {CalendarLesson, Club, ClubRank, Group, Title,} from '../models/club.model';
import {group} from "@angular/animations";
import {ClubCode} from "../models/club-code.model";

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  initialClubValue: Club = {name: '', description: '', groups: [], defaultTitle: -1, titles: [], id: '', users: [], announcements: [], payment: JSON, properties: {}}
  initialGroupValue: Group = {id: '', name: '', description: '', admins: [], participants: [], lessons: []};
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

  async pushClub(club: Club) {
    const clubs = this.clubs$.getValue().filter(c => c.id != club.id);
    clubs.push(club);
    this.clubs$.next(clubs);
  }

  getClub(id: string) {
    return this.clubs$.getValue().find(club => club.id == id) ?? this.initialClubValue;
  }

  getGroup(clubId: string, groupId: string) {
    try {
      return this.getClub(clubId).groups.find(group => group.id == groupId) ?? this.initialGroupValue;
    } catch {
      return this.initialGroupValue;
    }
  }

  async createClub(name: string, description: string) {
    const auth = localStorage.getItem('auth');

    this.http.post<Club>( environment.apiBaseUrl + '/clubs/', {name, description}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.clubs$.next([...this.clubs$.getValue(), club]))
    ).subscribe();
  }

  async removeClub(clubId: string) {
    const auth = localStorage.getItem('auth');

    this.http.delete<Club>( environment.apiBaseUrl + '/clubs/' + clubId, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.clubs$.next(this.clubs$.getValue().filter(c => c.id != club.id)))
    ).subscribe();
  }

  async updateClubInfo(id: string, name: string, description: string ){
    const auth = localStorage.getItem('auth');

    this.http.patch<Club>( environment.apiBaseUrl + '/clubs/' + id, {name, description}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.pushClub(club))
    ).subscribe();
  }

  async createClubCode(clubId: string) {
    const auth = localStorage.getItem('auth');

    this.http.post<ClubCode>( environment.apiBaseUrl + '/clubs/' + clubId + '/code', {}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).subscribe();
  }

  async getClubCode(clubId: string) {
    const { response, error } = await useFetch(Method.GET, `clubs/${clubId}/code`, {});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response?.data}
  }

  async getClubInfo(id: string) {
    const { response, error } = await useFetch(Method.GET, 'clubs/' + id, {});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response?.data}
  }

  async loadGroupsFromActiveClub(clubId: string) {
    const auth = localStorage.getItem('auth');
    const club = this.getClub(clubId);
    const rank = club.users.find(user => user.uuid == this.user$.getValue().uuid)?.rank;

    this.http.get<Group[]>(environment.apiBaseUrl + `/clubs/${club.id}/${rank == ClubRank.OWNER || rank == ClubRank.COACH ? 'groups' : 'groupsforuser'}`, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((groups: Group[]) => {
        club.groups = groups;

        this.pushClub(club);
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

  async removeUserFromClub(clubId: string, uuid: string) {
    const auth = localStorage.getItem('auth');

    this.http.delete<Club>(environment.apiBaseUrl + `/clubs/${this.getClub(clubId).id}/users/${uuid}` ,{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => {
        this.pushClub(club)
      })
    ).subscribe();
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

  async createGroup(clubId: string, name: string, description: string) {
    const auth = localStorage.getItem('auth');

    this.http.post<Club>(environment.apiBaseUrl + '/clubs/' + clubId + '/groups/', {name, description},{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.pushClub(club))
    ).subscribe();
  }

  async addUsersToGroup(clubId: string, groupId: string, uuids: string[]) {
    const auth = localStorage.getItem('auth');

    this.http.post<Club>(environment.apiBaseUrl + '/clubs/' + clubId + '/groups/' + groupId + '/users', {uuids},{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.pushClub(club))
    ).subscribe();
  }

  async removeUserFromGroup(clubId: string, groupId: string, uuid: string) {
    const auth = localStorage.getItem('auth');

    this.http.delete<Club>(environment.apiBaseUrl + '/clubs/' + clubId + '/groups/' + groupId + '/users/' + uuid ,{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.pushClub(club))
    ).subscribe();
  }

  async updateGroup(clubId: string, groupId: string, name: string, description: string) {
    const auth = localStorage.getItem('auth');

    this.http.patch<Club>(environment.apiBaseUrl + '/clubs/' + clubId + '/groups/' + groupId, {name, description}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
        tap((club: Club) => this.pushClub(club))
    ).subscribe();
  }

  async removeGroup(clubId: string, groupId: string) {
    const auth = localStorage.getItem('auth');
    this.http.delete<Club>(environment.apiBaseUrl + '/clubs/' + clubId + '/groups/' + groupId ,{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.pushClub(club))
    ).subscribe();
  }

  async addTitles(clubId: string, titles: Title[]) {
    const auth = localStorage.getItem('auth');
    const club = this.getClub(clubId);

    club.titles = titles;

    this.http.patch<Club>( environment.apiBaseUrl + '/clubs/' + clubId, {name: club.name, description: club.description, titles: club.titles}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
        tap((club: Club) => this.pushClub(club))
    ).subscribe();
  }

  async setDefaultTitle(clubId: string, defaultTitleId: number) {
    const auth = localStorage.getItem('auth');
    const club = this.getClub(clubId);

    this.http.patch<Club>( environment.apiBaseUrl + '/clubs/' + clubId, {name: club.name, description: club.description, defaultTitle: defaultTitleId}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
        tap((club: Club) => this.pushClub(club))
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
