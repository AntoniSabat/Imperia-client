import { Component, OnInit } from '@angular/core';
import {ClubsService} from "../../../../services/clubs.service";
import {ModalController} from "@ionic/angular";
import {UsersService} from "../../../../services/users.service";
import {logIn} from "ionicons/icons";

@Component({
  selector: 'app-show-club-users',
  templateUrl: './show-club-users.component.html',
  styleUrls: ['./show-club-users.component.scss'],
})
export class ShowClubUsersComponent  implements OnInit {
  activeClub$ = this.clubsService.activeClub$;
  activeGroup$ = this.clubsService.activeGroup$;
  getUser = this.usersService.getUser;

  constructor(private clubsService: ClubsService, private modalCtrl: ModalController, private usersService: UsersService) { }

  async ngOnInit() {
    await this.usersService.addUsersData(this.activeClub$.getValue().groups.find(group => group.id == this.activeGroup$.getValue())?.participants ?? []);
  }

  async back() {
    await this.modalCtrl.dismiss();
  }
}
