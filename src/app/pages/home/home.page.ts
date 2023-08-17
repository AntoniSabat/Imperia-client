import { Component, OnInit } from '@angular/core';
import axios from "axios";
import {UsersService} from "../../services/users.service";
import {ModalController} from "@ionic/angular";
import {ProfileDetailsComponent} from "../../components/modals/profile/profile-details/profile-details.component";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userImageSrc = '';
  shouldDisplayImage = false;
  user$ = this.usersService.user$;
  constructor(private usersService: UsersService, private modalCtrl: ModalController, private router: Router) { }

  async ngOnInit() {
    await this.whoAmI();
  }

  checkImageUrl(url: string) {
    if (!url) return false;
    else {
      const pattern = new RegExp('^https?:\\/\\/.+\\.(png|jpg|jpeg|bmg|gif|webp)$', 'i');
      return pattern.test(url);
    }
  }

  async whoAmI() {
    await this.usersService.loadActiveUser();
    this.userImageSrc =  environment.apiBaseUrl + '/files/' + this.user$.getValue().profileImg;
    this.shouldDisplayImage = this.checkImageUrl(this.userImageSrc);
  }

  async showProfileDetails() {
    const modal = await this.modalCtrl.create({
      component: ProfileDetailsComponent
    })
    await modal.present();
  }

  showAnnouncementDetails() {
    console.log('pokazuje szczegóły ogłoszenia')
  }

  goToCalendar() {
    this.router.navigate(['calendar']);
  }
  goToClubs() {
    this.router.navigate(['clubs']);
  }
  goToPayments() {
    this.router.navigate(['payments'])
  }
}
