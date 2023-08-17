import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {ModalController} from "@ionic/angular";
import {PersonalInfoComponent} from "../../components/modals/profile/edit-personal-info/personal-info.component";
import {lostSession} from "../../axios";
import {Router} from "@angular/router";
import {Preferences, User} from "../../models/user.model";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user$ = this.usersService.user$;
  preferences$ = this.usersService.preferences$;
  preferences: Preferences = {announcementsNotifications: false, lessonsNotifications: false, conversationsNotifications: false, darkMode: false};


  constructor(private usersService: UsersService, private modalCtrl: ModalController, private router: Router, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    await this.whoAmI();
    await this.getPreferences();
  }

  async whoAmI() {
    await this.usersService.loadActiveUser();
  }

  async editPersonalInfo(field: string) {
    this.usersService.setEditingAccountField(field);

    const modal = await this.modalCtrl.create({
      component: PersonalInfoComponent
    })
    await modal.present();

    const {role} = await modal.onDidDismiss();
    if (role === 'save')
      await this.usersService.loadActiveUser();
  }

  async changeUserPreferences() {
    const newPreferences: Preferences = {
      announcementsNotifications: this.preferences.announcementsNotifications,
      conversationsNotifications: this.preferences.conversationsNotifications,
      lessonsNotifications: this.preferences.lessonsNotifications,
      darkMode: this.preferences.darkMode
    }
    await this.usersService.editPreferences(newPreferences);
  }

  async getPreferences() {
    await this.usersService.loadPreferences();
  }

  async logOut() {
    await lostSession();
    await this.router.navigate(['']);
  }
}
