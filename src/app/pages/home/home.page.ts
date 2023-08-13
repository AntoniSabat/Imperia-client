import { Component, OnInit } from '@angular/core';
import axios from "axios";
import {UsersService} from "../../services/users.service";
import {ModalController} from "@ionic/angular";
import {ProfileDetailsComponent} from "../../components/modals/profile-details/profile-details.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userName = '';
  constructor(private usersService: UsersService, private modalCtrl: ModalController, private router: Router) { }

  async ngOnInit() {
    await this.whoAmI();
  }

  async whoAmI() {
    const response = await this.usersService.whoAmI();
    this.userName = response?.data.name;
    this.usersService.setActiveUser(response?.data);
  }

  async showProfileDetails() {
    const modal = await this.modalCtrl.create({
      component: ProfileDetailsComponent
    })
    await modal.present();
  }

  goToCalendar() {
    this.router.navigate(['calendar']);
  }
  goToClubs() {
    this.router.navigate(['clubs']);
  }
}
