import {Injectable, OnInit} from '@angular/core';
import {Method, useFetch} from "../axios";
import {Club, ClubRank, Group, Titles} from "../models/club.model";
import {Announcement} from "../models/announcement.model";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";
import {environment} from "../../environments/environment";
import {User} from "../models/user.model";
import {UsersService} from "./users.service";

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
  titles$ = new BehaviorSubject<any[]>([]);

  announcements$: BehaviorSubject<Announcement[]> = new BehaviorSubject<Announcement[]>([]);
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

  async createGroup(name: string, description: string) {
    console.log(name, description, this.activeClub.id)
    const auth = localStorage.getItem('auth');

    this.http.post<Group>(environment.apiBaseUrl + '/clubs/' + this.activeClub.id + '/groups/', {name, description },{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((group: Group) => this.groups$.next([...this.groups$.getValue(), group]))
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

    this.http.get<any[]>(environment.apiBaseUrl + '/clubs/' + this.activeClub.id + '/groups/' + this.activeGroup.id + '/titles',{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((titles: any[]) => this.titles$.next(titles))
    ).subscribe();
  }

  addTitle(title: string | number | null | undefined) {
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
