import { Component, OnInit } from '@angular/core';
import {ClubsService} from "../../../../services/clubs.service";
import {Club} from "../../../../models/club.model";
import {ModalController} from "@ionic/angular";
import {User} from "../../../../models/user.model";
import {UsersService} from "../../../../services/users.service";

@Component({
  selector: 'app-show-club-users',
  templateUrl: './show-club-users.component.html',
  styleUrls: ['./show-club-users.component.scss'],
})
export class ShowClubUsersComponent  implements OnInit {
  club!: Club;
  usersID: any = [];
  users: any = [];

  constructor(private clubsService: ClubsService, private modalCtrl: ModalController, private usersService: UsersService) { }

  async ngOnInit() {
    this.club = this.clubsService.getActiveClub();
    this.usersID = this.club.users;
    await this.getUsers();
  }

  async getUsers() {
    this.usersID.map(async (user: {uuid: string, rank: string, _id: string}) => {
      const res = await this.usersService.getUserInfo(user.uuid);
      this.users.push(res.data);
    })
  }

  async back() {
    await this.modalCtrl.dismiss();
  }
}
