import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {ModalController} from "@ionic/angular";
import {PersonalInfoComponent} from "../../components/modals/profile/edit-personal-info/personal-info.component";
import {lostSession} from "../../axios";
import {Router} from "@angular/router";
import {checkImageUrl, formatImageUrl} from "../../utils";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user$ = this.usersService.user$;

  checkImageUrl = checkImageUrl;
  formatImageUrl = formatImageUrl;

  constructor(private usersService: UsersService, private modalCtrl: ModalController, private router: Router) { }

  async ngOnInit() {
    await this.whoAmI();
  }

  async whoAmI() {
    await this.usersService.loadActiveUser();
  }

  async editPersonalInfo(field: string) {
    const modal = await this.modalCtrl.create({
      component: PersonalInfoComponent,
      componentProps: {
        field: field
      }
    })
    await modal.present();

    const {role} = await modal.onDidDismiss();
    if (role === 'save')
      await this.usersService.loadActiveUser();
  }

  async changeUserPreferences() {
    console.log(this.user$.getValue().preferences)
    await this.usersService.editPreferences(this.user$.getValue().preferences)
  }


  async logOut() {
    await lostSession();
    await this.router.navigate(['']);
  }
}
