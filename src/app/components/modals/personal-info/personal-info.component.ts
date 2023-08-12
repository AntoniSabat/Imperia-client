import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UsersService, UserType} from "../../../services/users.service";
import {Club} from "../../../models/club.model";

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent  implements OnInit {
  userData = {
    name: '',
    surname: '',
    email: '',
  }

  constructor(private modalCtrl: ModalController, private usersService: UsersService) { }

  async cancel() {
    await this.modalCtrl.dismiss(null, 'back');
  }

  async ngOnInit() {
    await this.whoAmI();
  }

  async whoAmI() {
    const response = await this.usersService.getActiveUser();
    this.userData.name = response.name;
    this.userData.surname = response.surname;
    this.userData.email = response.email;
  }

}
