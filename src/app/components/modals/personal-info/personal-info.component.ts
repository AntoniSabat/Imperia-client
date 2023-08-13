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
    uuid: '',
    name: '',
    surname: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  editingField = '';


  constructor(private modalCtrl: ModalController, private usersService: UsersService) { }

  async cancel() {
    await this.modalCtrl.dismiss(null, 'back');
  }

  async ngOnInit() {
    await this.whoAmI();
    this.editingField = this.usersService.getEditingAccountField();
  }

  async whoAmI() {
    const response = await this.usersService.getActiveUser();
    this.userData.name = response.name;
    this.userData.surname = response.surname;
    this.userData.email = response.email;
    this.userData.uuid = response.uuid;
  }

  async editData() {
    if (this.editingField === 'password') {
      console.log('zmieniam haslo');
      if (this.userData.newPassword !== this.userData.confirmPassword)
        console.log('Hasła nie są takie same');
      else {
        const response = await this.usersService.editPassword(this.userData.email, this.userData.oldPassword, this.userData.newPassword);
      }
    }
    else {
      console.log('zmieniam imie, nazwisko, email')
      const response = await this.usersService.editPersonalData(this.userData.name, this.userData.surname, this.userData.email);
      console.log(response);
    }

    await this.cancel();
  }
}
