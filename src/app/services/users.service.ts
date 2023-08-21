import {Injectable} from '@angular/core';
import {Method, useFetch} from "../axios";
import {Preferences, User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {Club} from "../models/club.model";
import {environment} from "../../environments/environment";
import {BehaviorSubject, tap} from "rxjs";

export enum UserType {
  COACH = 'COACH',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  activeUserData!: User;
  editingAccountField = '';
  userInitialValue: User = {
    name: '',
    surname: '',
    email: '',
    password: '',
    type: UserType.STUDENT,
    uuid: '',
    clubs: [],
    conversations: [],
    profileImg: '',
    preferences: {
      darkMode: true,
      conversationsNotifications: true,
      lessonsNotifications: true,
      announcementsNotifications: true
    }
  };
  preferencesInitialValue: Preferences = {announcementsNotifications: false, conversationsNotifications: false, lessonsNotifications: false, darkMode: false };

  user$ = new BehaviorSubject<User>(this.userInitialValue);
  clubUsers$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  groupUsers$ = new BehaviorSubject<User[]>([]);
  preferences$ = new BehaviorSubject<Preferences>(this.preferencesInitialValue);

  constructor(private http: HttpClient) {}

  async signin(email: string, password: string) : Promise<any> {
    const { response, error } = await useFetch(Method.POST, 'auth/signin', {email, password});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response?.data?.access_token}
  }

  async signup(name: string, surname: string, type: UserType, email: string, password: string): Promise<any> {
    const { response, error } = await useFetch(Method.POST, 'auth/signup', {name, surname, type, email, password});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response?.data?.access_token}
  }

  async loadActiveUser() {
    const auth = localStorage.getItem('auth');

    this.http.get<User>( environment.apiBaseUrl + '/users/info', {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((user: User) => this.user$.next(user))
    ).subscribe();
  }

  // async loadUsersInfo(uuids: string[]) {
  //   const auth = localStorage.getItem('auth');
  //
  //   this.http.post<User[]>( environment.apiBaseUrl + '/users/uuids', {uuids}, {
  //     headers: auth ? {Authorization: `Bearer ${auth}`} : {}
  //   }).pipe(
  //     tap((users: User[]) => this.users$.next(users))
  //   ).subscribe();
  // }
  async loadClubUsersInfo(uuids: string[]) {
    const auth = localStorage.getItem('auth');

    this.http.post<User[]>( environment.apiBaseUrl + '/users/uuids', {uuids}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((users: User[]) => this.clubUsers$.next(users))
    ).subscribe();
  }
  async loadGroupUsersInfo(uuids: string[]) {
    const auth = localStorage.getItem('auth');

    this.http.post<User[]>( environment.apiBaseUrl + '/users/uuids', {uuids}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((users: User[]) => this.groupUsers$.next(users))
    ).subscribe();
  }

  async editPassword(email: string, oldPassword: string, newPassword: string) {
    const auth = localStorage.getItem('auth');

    this.http.post<User>( environment.apiBaseUrl + '/users/editpassword', {email, oldPassword, newPassword}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((user: User) => this.user$.next(user))
    ).subscribe();
  }

  async editPersonalData(name: string, surname: string, email: string) {
    const auth = localStorage.getItem('auth');

    this.http.patch<User>( environment.apiBaseUrl + '/users/', {name, surname, email}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((user: User) => this.user$.next(user))
    ).subscribe();
  }

  async editPreferences(preferences: Preferences) {
    const auth = localStorage.getItem('auth');

    this.http.patch<Preferences>( environment.apiBaseUrl + '/users/preferences', preferences, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((preferences: Preferences) => this.preferences$.next(preferences))
    ).subscribe();
  }

  async loadPreferences() {
    const auth = localStorage.getItem('auth');

    this.http.get<Preferences>( environment.apiBaseUrl + '/users/preferences', {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((preferences: Preferences) => this.preferences$.next(preferences))
    ).subscribe();
  }

  getActiveUser() {
   return this.activeUserData;
  }

  setEditingAccountField(field: string) {
    this.editingAccountField = field;
  }
  getEditingAccountField() {
    return this.editingAccountField;
  }
}
