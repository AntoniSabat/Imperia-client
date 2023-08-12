import {Injectable} from '@angular/core';
import {Method, useFetch} from "../axios";

export enum UserType {
  COACH = 'COACH',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
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
}
