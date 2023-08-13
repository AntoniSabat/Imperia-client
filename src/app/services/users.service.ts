import {Injectable} from '@angular/core';
import {Method, useFetch} from "../axios";
import {User} from "../models/user.model";

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

  async whoAmI() {
    const { response, error} = await useFetch(Method.GET, 'auth/whoami', {});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response?.data}
  }

  async editPassword(email: string, oldPassword: string, newPassword: string) {
    const {response, error} = await useFetch(Method.POST, 'users/editpassword', {email, oldPassword, newPassword})

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response}
  }

  // TODO: Naprawić update danych (hasło działa), błąd raczej po stronie serwera
  async editPersonalData(name: string, surname: string, email: string) {
    const {response, error} = await useFetch(Method.PATCH, 'users', {name, surname, email});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response}
  }

  setActiveUser(data: User) {
    this.activeUserData = data;
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
