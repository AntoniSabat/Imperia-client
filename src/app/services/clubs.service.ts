import {Injectable} from '@angular/core';
import {Method, useFetch} from "../axios";
import {Club, ClubRank} from "../models/club.model";
import {Announcement} from "../models/announcement.model";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";
import {environment} from "../../environments/environment";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  activeClub!: Club;
  clubs$: BehaviorSubject<Club[]> = new BehaviorSubject<Club[]>([]);
  announcements$: BehaviorSubject<Announcement[]> = new BehaviorSubject<Announcement[]>([]);
  constructor(private http: HttpClient) {}

  async getClubInfo(id: string) {
    const { response, error } = await useFetch(Method.GET, 'clubs/' + id, {});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response?.data}
  }

  async getClubs() {
    const { response, error } = await useFetch(Method.GET, 'clubs/', {});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response}
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
    const { response, error } = await useFetch(Method.POST, 'clubs/join', {clubCode});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response}
  }

  async addAnnouncement(cludId: string, body: Announcement) {
    const auth = localStorage.getItem('auth');

    this.http.post<Announcement>( environment.apiBaseUrl + '/clubs/' + cludId + '/announcements', body,{
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((announcement: Announcement) => this.announcements$.next([...this.announcements$.getValue(), announcement]))
    ).subscribe();
  }

  async getGroups() {
    const { response, error } = await useFetch(Method.GET, 'clubs/' + this.activeClub.id + '/allgroups', {});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response}
  }

  async createAnnouncement(clubs: Club[], body: Announcement) {
    const announcement = clubs.map(async(club: Club) => {
      const {response, error} = await useFetch(Method.POST, 'clubs/' + club.id + '/announcements', body);

      if (error)
        return {status: 'error', data: error};
      else
        return {status: 'correct', data: response}
    })
    console.log(announcement)

    // const { response, error } = await useFetch(Method.POST, 'clubs/' + this.activeClub.id + '/announcements', body);
    //
    // if (error)
    //   return {status: 'error', data: error};
    // else
    //   return {status: 'correct', data: response}
  }

  setActiveClub(data: Club) {
    this.activeClub = data;
  }
  getActiveClub() {
    return this.activeClub;
  }
}
