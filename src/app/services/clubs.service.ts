import { Injectable } from '@angular/core';
import {Method, useFetch} from "../axios";
import {User} from "../models/user.model";
import {Club} from "../models/club.model";

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  activeClub!: Club;

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

  async getGroups() {
    const { response, error } = await useFetch(Method.GET, 'clubs/' + this.activeClub.id + '/allgroups', {});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response}
  }

  setActiveClub(data: Club) {
    this.activeClub = data;
  }
  getActiveClub() {
    return this.activeClub;
  }

  constructor() { }
}
