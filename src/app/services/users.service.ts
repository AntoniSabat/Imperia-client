import {Injectable} from '@angular/core';
import {Method, useFetch} from "../axios";
import {Preferences, User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, tap} from "rxjs";
import {ModalController} from "@ionic/angular";
import {ShowUserInfoComponent} from "../components/modals/users/show-user-info/show-user-info.component";

export enum UserType {
  COACH = 'COACH',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  OWNER = 'OWNER',
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userInitialValue: User = {
    name: '',
    surname: '',
    email: '',
    password: '',
    type: UserType.STUDENT,
    uuid: '',
    clubs: [],
    conversations: [],
    profileImage: '',
    preferences: {
      darkMode: true,
      conversationsNotifications: true,
      lessonsNotifications: true,
      announcementsNotifications: true
    }
  };

  user$ = new BehaviorSubject<User>(this.userInitialValue);
  usersData$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient, private modalCtrl: ModalController) {
    this.loadActiveUser()
  }

  async showUserProfile(clubId: string, groupId: string, uuid: string, level: string) {
    const modal = await this.modalCtrl.create({
      component: ShowUserInfoComponent,
      componentProps: {
        clubId: clubId,
        groupId: groupId,
        uuid: uuid,
        level: level
      }
    })
    await modal.present();
  }

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

    this.http.get<any>( environment.apiBaseUrl + '/users/info', {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((user: any) => this.user$.next(user))
    ).subscribe();
  }

  async getUserInfo(id: string) {
    const { response, error } = await useFetch(Method.GET, 'users/' + id, {});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response?.data}
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

  async addUsersData(uuids: string[]) {
    const auth = localStorage.getItem('auth');

    const loadedUuids = this.usersData$.getValue().map(user => user.uuid);
    const uniqueUuids = uuids.filter(uuid => !loadedUuids.includes(uuid));

    if (uniqueUuids.length <= 0) return;

    this.http.post<User[]>( environment.apiBaseUrl + '/users/uuids', {uuids: uniqueUuids}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((newUsers: User[]) => this.usersData$.next([...this.usersData$.getValue(), ...newUsers]))
    ).subscribe();
  }

  getUser(uuid: string) : User {
    return [...this.usersData$.getValue(), this.user$.getValue()].find(user => user.uuid == uuid) ?? this.userInitialValue;
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

    this.http.patch<User>( environment.apiBaseUrl + '/users/', {preferences}, {
      headers: auth ? {Authorization: `Bearer ${auth}`} : {}
    }).pipe(
      tap((user: User) => {
        this.user$.next(user)
      })
    ).subscribe();
  }
}
