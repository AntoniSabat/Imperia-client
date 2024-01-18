import { Component, OnInit } from '@angular/core';
import {UsersService, UserType} from "../../services/users.service";
import {Club} from "../../models/club.model";
import {ClubsService} from "../../services/clubs.service";
import {AlertController, ModalController} from "@ionic/angular";
import {ClubInfoComponent} from "../../components/clubs/club-info/club-info.component";
import {async} from "rxjs";

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.page.html',
  styleUrls: ['./clubs.page.scss'],
})
export class ClubsPage implements OnInit {
  clubs$ = this.clubsService.clubs$;
  user$ = this.usersService.user$;

  constructor(private usersService: UsersService, private clubsService: ClubsService, private modalCtrl: ModalController, private alertController: AlertController) { }

  async ngOnInit() {
    await this.usersService.loadActiveUser();
    await this.clubsService.loadClubs();
  }

  async showClubDetails(club: Club) {
    await this.clubsService.loadGroupsFromActiveClub(club.id);

    const modal = await this.modalCtrl.create({
      component: ClubInfoComponent,
      componentProps: {
        clubId: club.id
      }
    })
    await modal.present();
  }

  async joinClub(e: any) {
    if (e.detail.role === 'ok') {
      const clubCode = String(Object.entries(e.detail.data.values)[0][1]);
      await this.clubsService.joinClub(clubCode)
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async (e) => {
            await this.clubsService.createClub(e.name, e.description);
          }
        },
      ],
    });
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
    { text: 'OK', role: 'ok',}
  ]

  async createClub(e: any) {
    if (e.detail.role === 'ok') {
      const name = e.detail.data.values[0];
      const desc = e.detail.data.values[1];
      console.log(name, desc)
      await this.clubsService.createClub(name, desc);
    }
  }

  protected readonly UserType = UserType;
}
