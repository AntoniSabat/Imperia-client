import { Component, OnInit } from '@angular/core';
import {Club, ClubRank, Group} from "../../../../models/club.model";
import {ClubsService} from "../../../../services/clubs.service";
import {ModalController} from "@ionic/angular";
import {ShowClubUsersComponent} from "../show-club-users/show-club-users.component";
import {UsersService, UserType} from "../../../../services/users.service";
import {GroupInfoComponent} from "../../groups/group-info/group-info.component";

@Component({
  selector: 'app-club-info',
  templateUrl: './club-info.component.html',
  styleUrls: ['./club-info.component.scss'],
})
export class ClubInfoComponent  implements OnInit {
  club!: Club;
  user$ = this.usersService.user$;
  groups$ = this.clubsService.groups$;
  noGroups = false;

  constructor(private clubsService: ClubsService, private modalCtrl: ModalController, private usersService: UsersService) { }

  async ngOnInit() {
    this.club = this.clubsService.getActiveClub();
    await this.getGroups();
  }

  async back() {
    await this.modalCtrl.dismiss(null, 'back');
  }

  async showClubUsers() {
    const modal = await this.modalCtrl.create({
      component: ShowClubUsersComponent
    })
    await modal.present();
  }

  async getGroups() {
    await this.clubsService.loadGroups();
    if (this.groups$.getValue().length === 0)
      this.noGroups = true;
  }

  createGroupInputs = [
    { placeholder: 'Name'},
    { placeholder: "Description"},
  ]
  async createGroup(e: any) {
    if (e.detail.role === 'ok') {
      const data = e.detail.data.values;
      const name = data[0];
      const desc = data[1];

      await this.clubsService.createGroup(name, desc);
    }
  }

  async showGroupDetails(group: Group) {
    this.clubsService.setActiveGroup(group);
    const modal = await this.modalCtrl.create({
      component: GroupInfoComponent
    })
    await modal.present();
  }

  protected readonly ClubRank = ClubRank;
  protected readonly UserType = UserType;
}
