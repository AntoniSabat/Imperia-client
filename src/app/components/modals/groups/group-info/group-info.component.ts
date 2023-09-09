import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {IonInput, ModalController} from "@ionic/angular";
import {ClubsService} from "../../../../services/clubs.service";
import {AddUserToGroupComponent} from "../add-user-to-group/add-user-to-group.component";
import {UsersService} from "../../../../services/users.service";
import {BehaviorSubject} from "rxjs";
import {User} from "../../../../models/user.model";
import { ShowUsersComponent } from "../show-users/show-users.component";

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss'],
})
export class GroupInfoComponent  implements OnInit {
  activeClub$ = this.clubsService.activeClub$;
  activeGroup$ = this.clubsService.activeGroup$;
  usersData$ = this.usersService.usersData$;
  limitedGroupUsers$ = new BehaviorSubject<User[]>([]);
  getGroup = this.clubsService.getGroup;
  constructor(private modalCtrl: ModalController, private clubsService: ClubsService, private usersService: UsersService) { }

  async loadLimitedUsers(groupId: string) {
    const group = this.getGroup(groupId);
    const groupUsers = [...group.admins, ...group.participants].map(uuid => this.usersService.getUser(uuid)).sort((a, b) => a.surname.localeCompare(b.surname));
    if (groupUsers.length > 5)
      groupUsers.length = 5;
    this.limitedGroupUsers$.next(groupUsers);
  }

  async ngOnInit() {
    await this.usersService.addUsersData(this.activeClub$.getValue().groups.find(group => group.id == this.activeGroup$.getValue())?.participants ?? []);
    this.usersData$.subscribe(() => this.loadLimitedUsers(this.activeGroup$.getValue()));
    this.activeClub$.subscribe(() => this.loadLimitedUsers(this.activeGroup$.getValue()))
  }

  async back() {
    await this.modalCtrl.dismiss();
  }

  editGroup() {
    console.log('edytuje grupe')
  }

  async addUsers() {
    const modal = await this.modalCtrl.create({
      component: AddUserToGroupComponent
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
  }

  async seeAllGroupUsersModal() {
    const modal = await  this.modalCtrl.create({
      component: ShowUsersComponent
    })
    await modal.present();
  }
}
