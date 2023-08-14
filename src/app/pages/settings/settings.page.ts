import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users.service";
import {ModalController} from "@ionic/angular";
import {PersonalInfoComponent} from "../../components/modals/profile/edit-personal-info/personal-info.component";
import {lostSession} from "../../axios";
import {Router} from "@angular/router";
import {book} from "ionicons/icons";
import {Preferences, User} from "../../models/user.model";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user$!: BehaviorSubject<User>;
  userName = '';
  userSurname = '';
  userEmail = '';
  preferences!: Preferences;

  constructor(private usersService: UsersService, private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() {
    this.whoAmI();
    this.getPreferences();
  }

  whoAmI() {
    const response = this.usersService.getActiveUser();
    this.userName = response.name;
    this.userSurname = response.surname;
    this.userEmail = response.email;
    this.preferences = response.preferences;
  }

  async editPersonalInfo(field: string) {
    this.usersService.setEditingAccountField(field);

    const modal = await this.modalCtrl.create({
      component: PersonalInfoComponent
    })
    await modal.present();

    // const {role} = await modal.onDidDismiss();
    // if (role === 'save')
    //   this.usersService.loadActiveUser(this.usersService.getActiveUser().uuid);
  }

  async changeUserPreferences() {
    const checkboxes = Array.from(document.querySelectorAll('ion-checkbox'));
    const preferences = checkboxes.map(preference => preference.checked);
    const newPreferences = {
      announcementsNotifications: preferences[0],
      conversationsNotifications: preferences[1],
      lessonsNotifications: preferences[2],
      darkMode: preferences[3]
    };

    const response = await this.usersService.editPreferences(newPreferences);
  }

  async getPreferences() {
    console.log(this.preferences)
    const checkboxes = Array.from(document.querySelectorAll('ion-checkbox'));
    checkboxes.forEach((checkbox: HTMLIonCheckboxElement, index: number) => {
      if (Object.keys(this.preferences).includes(checkbox.name)) {
        const temp = Object.entries(this.preferences);
        const result = temp.find(obj => obj[0] === checkbox.name);
        if (result) {
          checkbox.checked = Boolean(result[1]);
        }
      }
    })
  }

  async logOut() {
    await lostSession();
    await this.router.navigate(['']);
  }
}
