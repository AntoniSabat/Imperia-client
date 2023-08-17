import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UsersService, UserType} from "../../../../services/users.service";
import {Club} from "../../../../models/club.model";

@Component({
  selector: 'app-edit-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent  implements OnInit {
  user$ = this.usersService.user$;
  userData = {
    uuid: '',
    name: '',
    surname: '',
    email: '',
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
    await this.usersService.loadActiveUser();
  }

  async editData() {
    if (this.editingField === 'password') {
      console.log('zmieniam haslo');
      if (this.userData.newPassword !== this.userData.confirmPassword)
        console.log('Hasła nie są takie same');
      else {
        await this.usersService.editPassword(this.user$.getValue().email, this.user$.getValue().password, this.userData.newPassword);
      }
    }
    else {
      console.log('zmieniam imie, nazwisko, email')
      await this.usersService.editPersonalData(this.user$.getValue().name, this.user$.getValue().surname, this.user$.getValue().email);
    }

    await this.modalCtrl.dismiss(null, 'save')
  }
}
