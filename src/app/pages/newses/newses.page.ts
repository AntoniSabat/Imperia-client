import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {
  AddAnnouncementComponent
} from "../../components/modals/announcements/add-announcement/add-announcement.component";

@Component({
  selector: 'app-newses',
  templateUrl: './newses.page.html',
  styleUrls: ['./newses.page.scss'],
})
export class NewsesPage {
  constructor(private modalCtrl: ModalController) {}
  showAnnouncementDetails() {
    console.log('otwieram szczegóły ogloszenia')
  }

  async addAnnouncement() {
    const modal = await this.modalCtrl.create({
      component: AddAnnouncementComponent
    })
    await modal.present();
  }
}
