import { Component, OnInit } from '@angular/core';
import {ClubsService} from "../../../../services/clubs.service";
import {ModalController} from "@ionic/angular";
import {UsersService} from "../../../../services/users.service";
import {BehaviorSubject} from "rxjs";
import {User} from "../../../../models/user.model";

@Component({
  selector: 'app-show-club-users',
  templateUrl: './show-club-users.component.html',
  styleUrls: ['./show-club-users.component.scss'],
})
export class ShowClubUsersComponent  implements OnInit {
  activeClub$ = this.clubsService.activeClub$;
  usersData$ = this.usersService.usersData$;
  users$ = new BehaviorSubject<User[]>([]);

  constructor(private clubsService: ClubsService, private modalCtrl: ModalController, private usersService: UsersService) {}

  async ngOnInit() {
    this.usersData$.subscribe(() => {
      this.users$.next(this.activeClub$.getValue().users.map(user => user.uuid).map(uuid => this.usersService.getUser(uuid)))
    })
    await this.usersService.addUsersData(this.activeClub$.getValue().users.map(user => user.uuid));
  }

  async back() {
    await this.modalCtrl.dismiss();
  }
}
