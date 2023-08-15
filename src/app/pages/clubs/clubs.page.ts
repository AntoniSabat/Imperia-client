import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users.service";
import {Club} from "../../models/club.model";
import {ClubsService} from "../../services/clubs.service";
import {ModalController} from "@ionic/angular";
import {ClubInfoComponent} from "../../components/modals/clubs/club-info/club-info.component";

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.page.html',
  styleUrls: ['./clubs.page.scss'],
})
export class ClubsPage implements OnInit {
  clubs: Club[] = [];

  constructor(private usersService: UsersService, private clubsService: ClubsService, private modalCtrl: ModalController) { }

  async ngOnInit() {
    await this.getClubs();
  }

  async getClubs() {
    const response = await this.clubsService.getClubs();
    this.clubs = response?.data?.data.map((club: Club) => club);
  }

  async showClubDetails(club: Club) {
    this.clubsService.setActiveClub(club);

    const modal = await this.modalCtrl.create({
      component: ClubInfoComponent
    })
    await modal.present();
  }

  joinClubInputs = [
    {
      placeholder: 'Code',
      attributes: {
        maxlength: 6,
      },
    }
  ]
  joinClubButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'OK',
      role: 'ok',
    }
  ]
  async joinClub(e: any) {
    if (e.detail.role === 'ok') {
      const clubCode = String(Object.entries(e.detail.data.values)[0][1]);
      await this.clubsService.joinClub(clubCode)
    }
  }
}
