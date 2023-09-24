import { Component, OnInit } from '@angular/core';
import {checkImageUrl, formatImageUrl} from "../../utils";
import {UsersService} from "../../services/users.service";
import {ProfileDetailsComponent} from "../../components/modals/profile/profile-details/profile-details.component";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  protected readonly formatImageUrl = formatImageUrl;
  protected readonly checkImageUrl = checkImageUrl;
  user$ = this.usersService.user$;

  constructor(
    private usersService: UsersService,
    private modalCtrl: ModalController,
  ) {}

  async showProfileDetails() {
    const modal = await this.modalCtrl.create({
      component: ProfileDetailsComponent
    })
    await modal.present();
  }

  ngOnInit() {
  }

}
