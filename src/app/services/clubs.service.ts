import {Injectable} from '@angular/core';
import {Method, useFetch} from "../axios";
import {Club, ClubRank, Group} from "../models/club.model";
import {Announcement} from "../models/announcement.model";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  activeClub! :Club;

  clubs$: BehaviorSubject<Club[]> = new BehaviorSubject<Club[]>([]);
  groups$ = new BehaviorSubject<Group[]>([]);
  announcements$: BehaviorSubject<Announcement[]> = new BehaviorSubject<Announcement[]>([]);
  constructor(private http: HttpClient) {}

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

  async joinClub(clubCode: string) {
    const auth = localStorage.getItem('auth');

    this.http.post<Club>( environment.apiBaseUrl + '/clubs/join', {clubCode}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((club: Club) => this.clubs$.next([...this.clubs$.getValue(), club]))
    ).subscribe();
  }

  async loadGroups() {
    const auth = localStorage.getItem('auth');

    this.http.get<Group[]>(environment.apiBaseUrl + '/clubs/' + this.activeClub.id + '/allgroups', {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((groups: Group[]) => this.groups$.next(groups))
    ).subscribe();
  }

  async createGroup(name: string, description: string, defaultTitle: number) {
    const auth = localStorage.getItem('auth');

    this.http.post<Group>(environment.apiBaseUrl + '/clubs/' + this.activeClub.id + '/groups/', {name, description, defaultTitle, titles: []  },{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((group: Group) => this.groups$.next([...this.groups$.getValue(), group]))
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
