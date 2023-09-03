import { Component, OnInit } from '@angular/core';
import {ClubsService} from "../../../../services/clubs.service";
import {UsersService} from "../../../../services/users.service";
import {User} from "../../../../models/user.model";
import {ModalController} from "@ionic/angular";
import {BehaviorSubject} from "rxjs";
import {Group} from "../../../../models/club.model";

@Component({
  selector: 'app-add-user-to-group',
  templateUrl: './add-user-to-group.component.html',
  styleUrls: ['./add-user-to-group.component.scss'],
})
export class AddUserToGroupComponent  implements OnInit {
  usersID$ = new BehaviorSubject<string[]>([]);
  activeGroup$ = this.clubsService.activeGroup$;
  activeClub$ = this.clubsService.activeClub$;
  usersData$ = this.usersService.usersData$;

  constructor(private clubsService: ClubsService, private usersService: UsersService, private modalCtrl: ModalController) { }

  async back() {
    await this.modalCtrl.dismiss('refresh');
  }

  async ngOnInit() {
    this.activeClub$.getValue().users.map((user: any) => {
      this.usersID$.next([...this.usersID$.getValue(), user.uuid])
    });

    await this.usersService.addUsersData(this.activeClub$.getValue().groups.find(group => group.id == this.activeGroup$.getValue())?.participants ?? []);
  }

  async addToGroup(user: string) {
    // await this.clubsService.addParticipantToGroup(user.uuid);
    // this.groupUsers$.next([...this.groupUsers$.getValue(), user ])
    //
    // const uuids = this.groupUsers$.getValue().map(groupUser => groupUser.uuid);
    // await this.usersService.loadGroupUsersInfo(uuids);
    //
    // const addedUser = this.clubUsers$.getValue().find(clubUser => clubUser.uuid === user.uuid);
    // console.log(this.clubUsers$.getValue(), addedUser)
  }
}
