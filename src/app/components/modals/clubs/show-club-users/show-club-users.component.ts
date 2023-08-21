import { Component, OnInit } from '@angular/core';
import {ClubsService} from "../../../../services/clubs.service";
import {Club} from "../../../../models/club.model";
import {ModalController} from "@ionic/angular";
import {User} from "../../../../models/user.model";
import {UsersService} from "../../../../services/users.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-show-club-users',
  templateUrl: './show-club-users.component.html',
  styleUrls: ['./show-club-users.component.scss'],
})
export class ShowClubUsersComponent  implements OnInit {
  club$ = this.clubsService.activeClub$;
  usersID$ = new BehaviorSubject<string[]>([]);
  clubUsers$ = this.usersService.clubUsers$;

  constructor(private clubsService: ClubsService, private modalCtrl: ModalController, private usersService: UsersService) { }

  async ngOnInit() {
    await this.clubsService.loadActiveClub();

    this.club$.getValue().users.map((user: any) => {
      this.usersID$.next([...this.usersID$.getValue(), user.uuid])
    });
    await this.getUsersInfo();
  }

  async getUsersInfo() {
    await this.usersService.loadClubUsersInfo(this.usersID$.getValue())
  }

  async back() {
    await this.modalCtrl.dismiss();
  }
}
