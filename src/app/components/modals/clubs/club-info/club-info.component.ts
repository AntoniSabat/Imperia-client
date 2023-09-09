import { Component, OnInit } from '@angular/core';
import {Club, ClubRank, Group} from "../../../../models/club.model";
import {ClubsService} from "../../../../services/clubs.service";
import {ModalController} from "@ionic/angular";
import {ShowClubUsersComponent} from "../show-club-users/show-club-users.component";
import {UsersService, UserType} from "../../../../services/users.service";
import {GroupInfoComponent} from "../../groups/group-info/group-info.component";
import {EditClubComponent} from "../edit-club/edit-club.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-club-info',
  templateUrl: './club-info.component.html',
  styleUrls: ['./club-info.component.scss'],
})
export class ClubInfoComponent  implements OnInit {
  activeClub$= this.clubsService.activeClub$;
  user$ = this.usersService.user$;

  constructor(private clubsService: ClubsService, private modalCtrl: ModalController, private usersService: UsersService, private router: Router) { }

  async ngOnInit() {}

  async back() {
    await this.modalCtrl.dismiss(null, 'back');
  }

  async showClubUsers() {
    const modal = await this.modalCtrl.create({
      component: ShowClubUsersComponent
    })
    await modal.present();
  }

  async createClubCode() {
    await this.clubsService.createClubCode(this.activeClub$.getValue().id);
  }

  async showClubCode() {
    const {status, data} = await this.clubsService.getClubCode(this.activeClub$.getValue().id);

    if (status == 'correct')
      alert(data?.code ?? "No code")
  }

  async editClub() {
    const modal = await this.modalCtrl.create({
      component: EditClubComponent,
    })
    await modal.present();

    const {data} = await modal.onDidDismiss();
    if (data === 'close') {
      await this.modalCtrl.dismiss();
    }
  }

  createGroupInputs = [
    { placeholder: 'Name', type: "text"},
    { placeholder: "Description", type: "text"},
  ]
  async createGroup(e: any) {
    if (e.detail.role === 'ok') {
      const data = e.detail.data.values;
      const name = data[0];
      const desc = data[1];

      if (name == '' && desc == '')
        alert('Name and description must be filled')
      else if (name == '')
        alert('Name must be filled')
      else if (desc == '')
        alert('Description must be filled')
      else
        await this.clubsService.createGroup(name, desc);
    }
  }

  async showGroupDetails(group: string) {
    this.clubsService.setActiveGroup(group);
    const modal = await this.modalCtrl.create({
      component: GroupInfoComponent
    })
    await modal.present();
  }

  protected readonly ClubRank = ClubRank;
  protected readonly UserType = UserType;
}
