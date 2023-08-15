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
  userName = '';
  userImageSrc = '';
  shouldDisplayImage = false;
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
    const response = await this.usersService.whoAmI();
    this.userName = response?.data.name;
    this.userImageSrc =  environment.apiBaseUrl + '/files/' + response?.data.profileImage;
    this.shouldDisplayImage = this.checkImageUrl(this.userImageSrc);
    this.usersService.setActiveUser(response?.data);
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
