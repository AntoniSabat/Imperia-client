import { Component, OnInit } from '@angular/core';
import {UsersService, UserType} from "../../services/users.service";
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
  clubs$= this.clubsService.clubs$;

  constructor(private usersService: UsersService, private clubsService: ClubsService, private modalCtrl: ModalController) { }

  async ngOnInit() {
    // who am I
    await this.usersService.loadActiveUser();
    // get clubs
    await this.clubsService.loadClubs();
  }

  async showClubDetails(club: Club) {
    await this.clubsService.setActiveClub(club);
    await this.clubsService.loadGroupsFromActiveClub();

    const modal = await this.modalCtrl.create({
      component: ClubInfoComponent
    })
    await modal.present();
  }

  joinClubInputs = [
    {
      placeholder: 'Code',
      attributes: {
        maxlength: 6
      },
    }
  ]
  createClubInputs = [
    { placeholder: 'Name' },
    { placeholder: 'Description' }
  ]
  clubButtons = [
    { text: 'Cancel', role: 'cancel'},
    { text: 'OK', role: 'ok'}
  ]

  async joinClub(e: any) {
    if (e.detail.role === 'ok') {
      const clubCode = String(Object.entries(e.detail.data.values)[0][1]);
      await this.clubsService.joinClub(clubCode)
    }
  }

  async createClub(e: any) {
    if (e.detail.role === 'ok') {
      const name = e.detail.data.values[0];
      const desc = e.detail.data.values[1];
      await this.clubsService.createClub(name, desc);
    }
  }

  protected readonly UserType = UserType;
}
