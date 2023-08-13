import { Injectable } from '@angular/core';
import {Method, useFetch} from "../axios";

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  async getClubInfo(id: string) {
    const { response, error } = await useFetch(Method.GET, 'clubs/' + id, {});

    if (error)
      return {status: 'error', data: error};
    else
      return {status: 'correct', data: response?.data}
  }

  constructor() { }
}
