import { Component, OnInit } from '@angular/core';
import {Club} from "../../../../models/club.model";
import {ClubsService} from "../../../../services/clubs.service";
import {ModalController} from "@ionic/angular";
import {ShowClubUsersComponent} from "../show-club-users/show-club-users.component";

@Component({
  selector: 'app-club-info',
  templateUrl: './club-info.component.html',
  styleUrls: ['./club-info.component.scss'],
})
export class ClubInfoComponent  implements OnInit {
  club!: Club;
  groups!: [];

  constructor(private clubsService: ClubsService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.club = this.clubsService.getActiveClub();
    this.getGroups();
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

  // TODO: Pobierać grupy i je wypisywać na ekranie
  async getGroups() {

  }
}
