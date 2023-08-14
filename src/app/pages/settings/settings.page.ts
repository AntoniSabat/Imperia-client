import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users.service";
import {ModalController} from "@ionic/angular";
import {PersonalInfoComponent} from "../../components/modals/profile/edit-personal-info/personal-info.component";
import {lostSession} from "../../axios";
import {Router} from "@angular/router";
import {book} from "ionicons/icons";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userName = '';
  userSurname = '';
  userEmail = '';

  constructor(private usersService: UsersService, private modalCtrl: ModalController, private router: Router) { }

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

  async changeUserPreferences() {
    const checkboxes = Array.from(document.querySelectorAll('ion-checkbox'));
    const preferences = checkboxes.map(preference => preference.checked)
    const newPreferences = {
      announcementsNotifications: preferences[0],
      conversationsNotifications: preferences[1],
      lessonsNotifications: preferences[2],
      darkMode: preferences[3]
    }
    const response = await this.usersService.editPreferences(newPreferences);
    console.log(response)
  }

  async logOut() {
    await lostSession();
    await this.router.navigate(['']);
  }
}
