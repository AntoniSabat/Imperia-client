import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ClubsService} from "../../../../services/clubs.service";
import {UsersService} from "../../../../services/users.service";
import {BehaviorSubject} from "rxjs";
import { User } from "../../../../models/user.model";

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.scss'],
})
export class ShowUsersComponent  implements OnInit {
  getGroup = this.clubsService.getGroup;
  activeGroup$ = this.clubsService.activeGroup$;
  activeClub$ = this.clubsService.activeClub$;
  usersData$ = this.usersService.usersData$;
  users$ = new BehaviorSubject<User[]>([]);

  constructor(private modalCtrl: ModalController, private clubsService: ClubsService, private usersService: UsersService) { }

  async ngOnInit() {
    this.usersData$.subscribe(() => {
      this.users$.next(this.activeClub$.getValue().users.map(user => user.uuid).map(uuid => this.usersService.getUser(uuid)))
    })
    await this.usersService.addUsersData(this.activeClub$.getValue().users.map(user => user.uuid));
  }

  async back() {
    await this.modalCtrl.dismiss()
  }
}
