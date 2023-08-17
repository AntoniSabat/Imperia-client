import { Component, OnInit } from '@angular/core';
import axios from "axios";
import {UsersService} from "../../services/users.service";
import {ModalController} from "@ionic/angular";
import {ProfileDetailsComponent} from "../../components/modals/profile/profile-details/profile-details.component";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import { ClubsService } from 'src/app/services/clubs.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userImageSrc = '';
  shouldDisplayImage = false;
  user$ = this.usersService.user$;
  lessons$ = this.clubsService.todayLessons$;
  constructor(private usersService: UsersService, private modalCtrl: ModalController, private router: Router, private clubsService: ClubsService) { }

  async ngOnInit() {
    await this.whoAmI();
    await this.clubsService.loadTodayLessons()
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
