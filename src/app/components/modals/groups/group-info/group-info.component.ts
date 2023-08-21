import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {IonInput, ModalController} from "@ionic/angular";
import {ClubsService} from "../../../../services/clubs.service";
import {AddUserToGroupComponent} from "../add-user-to-group/add-user-to-group.component";
import {UsersService} from "../../../../services/users.service";

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss'],
})
export class GroupInfoComponent  implements OnInit {
  activeGroup$ = this.clubsService.activeGroup$;
  groupUsers$ = this.usersService.groupUsers$;
  titles$ = this.clubsService.titles$;
  // group!: Group;
  constructor(private modalCtrl: ModalController, private clubsService: ClubsService, private usersService: UsersService, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    await this.clubsService.loadActiveGroup();
    await this.getUsersName();
    await this.clubsService.loadTitles();
  }

  async back() {
    await this.modalCtrl.dismiss();
  }

  async addUsers() {
    const modal = await this.modalCtrl.create({
      component: AddUserToGroupComponent
    })
    await modal.present();

    const { data } = await modal.onWillDismiss();
  }

  async getUsersName() {
    await this.usersService.loadGroupUsersInfo(this.activeGroup$.getValue().participants);
  }

  addTitle(input: IonInput) {
    this.clubsService.addTitle(input.value);
    input.value = '';
  }

  async setDefaultTitle(titleId: number) {
    await this.clubsService.updateGroupDefaultTitle(titleId);
  }
}
