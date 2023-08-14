import { Component, OnInit } from '@angular/core';
import {Club} from "../../../../models/club.model";
import {ClubsService} from "../../../../services/clubs.service";
import {ModalController} from "@ionic/angular";
import {ShowClubUsersComponent} from "../show-club-users/show-club-users.component";
import {Group} from "../../../../models/group.model";

@Component({
  selector: 'app-club-info',
  templateUrl: './club-info.component.html',
  styleUrls: ['./club-info.component.scss'],
})
export class ClubInfoComponent  implements OnInit {
  club!: Club;
  groups!: Group[];
  noGroups = false;

  constructor(private clubsService: ClubsService, private modalCtrl: ModalController) { }

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
    const response = await this.clubsService.getGroups();
    this.groups = response?.data?.data;
    if (!this.groups.length) this.noGroups = true;
  }
}
