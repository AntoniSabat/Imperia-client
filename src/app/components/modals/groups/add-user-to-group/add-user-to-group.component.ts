import { Component, OnInit } from '@angular/core';
import {ClubsService} from "../../../../services/clubs.service";
import {Club, ClubRank, Group} from "../../../../models/club.model";
import {UsersService} from "../../../../services/users.service";
import {User} from "../../../../models/user.model";
import {ModalController} from "@ionic/angular";
import {BehaviorSubject} from "rxjs";
import {add, logoGoogle} from "ionicons/icons";

@Component({
  selector: 'app-add-user-to-group',
  templateUrl: './add-user-to-group.component.html',
  styleUrls: ['./add-user-to-group.component.scss'],
})
export class AddUserToGroupComponent  implements OnInit {
  club$ = this.clubsService.activeClub$;
  group$ = this.clubsService.activeGroup$;
  usersID$ = new BehaviorSubject<string[]>([]);
  activeGroup$ = this.clubsService.activeGroup$;
  activeClub$ = this.clubsService.activeClub$;
  clubUsers$ = this.usersService.clubUsers$;
  groupUsers$ = this.usersService.groupUsers$;

  constructor(private clubsService: ClubsService, private usersService: UsersService, private modalCtrl: ModalController) { }

  async back() {
    await this.modalCtrl.dismiss('refresh');
  }

  async ngOnInit() {
    await this.clubsService.loadActiveClub();
    await this.clubsService.loadActiveGroup();

    this.club$.getValue().users.map((user: any) => {
      this.usersID$.next([...this.usersID$.getValue(), user.uuid])
    });
    await this.getUsersInfo();
  }

  async getUsersInfo() {
    await this.usersService.loadClubUsersInfo(this.usersID$.getValue())
    await this.usersService.loadGroupUsersInfo(this.activeGroup$.getValue().participants);
  }

  async addToGroup(user: User) {
    await this.clubsService.addParticipantToGroup(user.uuid);
    this.groupUsers$.next([...this.groupUsers$.getValue(), user ])

    const uuids = this.groupUsers$.getValue().map(groupUser => groupUser.uuid);
    await this.usersService.loadGroupUsersInfo(uuids);

    const addedUser = this.clubUsers$.getValue().find(clubUser => clubUser.uuid === user.uuid);
    console.log(this.clubUsers$.getValue(), addedUser)
  }
}
