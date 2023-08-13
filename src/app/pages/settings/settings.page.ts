import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users.service";
import {ModalController} from "@ionic/angular";
import {PersonalInfoComponent} from "../../components/modals/personal-info/personal-info.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userName = '';
  userSurname = '';
  userEmail = '';

  constructor(private usersService: UsersService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.whoAmI();
  }

  whoAmI() {
    const response = this.usersService.getActiveUser();
    this.userName = response.name;
    this.userSurname = response.surname;
    this.userEmail = response.email;
  }

  async editPersonalInfo(field: string) {
    this.usersService.setEditingAccountField(field);

    const modal = await this.modalCtrl.create({
      component: PersonalInfoComponent
    })
    await modal.present();
  }
}
