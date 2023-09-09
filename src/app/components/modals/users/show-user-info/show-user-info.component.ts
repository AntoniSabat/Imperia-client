import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UsersService} from "../../../../services/users.service";
import {ClubsService} from "../../../../services/clubs.service";

@Component({
  selector: 'app-show-user-info',
  templateUrl: './show-user-info.component.html',
  styleUrls: ['./show-user-info.component.scss'],
})
export class ShowUserInfoComponent  implements OnInit {
  userUuid$ = this.usersService.showUserUuid$;
  constructor(private modalCtrl: ModalController, public usersService: UsersService, private clubsService: ClubsService) { }

  async back() {
    await this.modalCtrl.dismiss();
  }

  ngOnInit() {}

  async removeUser() {
    console.log('usuwam z grupy')
    confirm("Are you sure you want to remove user from club?")
    await this.clubsService.removeUserFromGroup(this.userUuid$.getValue());
    await this.modalCtrl.dismiss();
  }

  async removeUserFromGroup() {
    console.log('usuwam z klubu')
    confirm("Are you sure you want to remove user from group?")
  }
}
