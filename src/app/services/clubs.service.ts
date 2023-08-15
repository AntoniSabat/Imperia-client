import {Injectable} from '@angular/core';
import {Method, useFetch} from "../axios";
import {Club} from "../models/club.model";
import {Announcement} from "../models/announcement.model";

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

  async joinClub(clubCode: string) {
    const { response, error } = await useFetch(Method.POST, 'clubs/join', {clubCode});

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
