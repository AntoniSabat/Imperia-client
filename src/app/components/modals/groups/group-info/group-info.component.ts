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
  activeClub$ = this.clubsService.activeClub$;
  activeGroup$ = this.clubsService.activeGroup$;
  usersData$ = this.usersService.usersData$;
  getGroup = this.clubsService.getGroup;
  getUser = this.usersService.getUser;

  constructor(private modalCtrl: ModalController, private clubsService: ClubsService, private usersService: UsersService) { }

  async ngOnInit() {
    await this.usersService.addUsersData(this.activeClub$.getValue().groups.find(group => group.id == this.activeGroup$.getValue())?.participants ?? []);
  }

  async back() {
    await this.modalCtrl.dismiss();
  }

  async addUsers() {
    const modal = await this.modalCtrl.create({
      component: AddUserToGroupComponent
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
  }
}
