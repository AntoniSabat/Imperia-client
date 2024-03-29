import {Component, Input, OnInit} from '@angular/core';
import {Club, ClubRank, Group} from "../../../../models/club.model";
import {ClubsService} from "../../../../services/clubs.service";
import {ModalController} from "@ionic/angular";
import {ShowClubUsersComponent} from "../show-club-users/show-club-users.component";
import {UsersService, UserType} from "../../../../services/users.service";
import {GroupInfoComponent} from "../../groups/group-info/group-info.component";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import { ClubSettingsComponent } from 'src/app/components/modals/clubs/club-settings/club-settings.component';

@Component({
  selector: 'app-club-info',
  templateUrl: './club-info.component.html',
  styleUrls: ['./club-info.component.scss'],
})
export class ClubInfoComponent implements OnInit {
  @Input() clubId!: string;
  club$!: BehaviorSubject<Club>
  user$ = this.usersService.user$;

  constructor(private clubsService: ClubsService, private modalCtrl: ModalController, private usersService: UsersService, private router: Router) { }

  async ngOnInit() {
    this.club$  = new BehaviorSubject<Club>(this.clubsService.getClub(this.clubId));
    this.clubsService.clubs$.subscribe(() => this.club$.next(this.clubsService.getClub(this.clubId)))
  }

  async back() {
    await this.modalCtrl.dismiss(null, 'back');
  }

  async showClubUsers() {
    const modal = await this.modalCtrl.create({
      component: ShowClubUsersComponent,
      componentProps: {
        clubId: this.clubId
      }
    })
    await modal.present();
  }

  async clubSettings() {
    const modal = await this.modalCtrl.create({
      component: ClubSettingsComponent,
      componentProps: {
        clubId: this.clubId
      }
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
        await this.clubsService.createGroup(this.clubId, name, desc);
    }
  }

  async showGroupDetails(groupId: string) {
    const modal = await this.modalCtrl.create({
      component: GroupInfoComponent,
      componentProps: {
        clubId: this.clubId,
        groupId: groupId
      }
    })
    await modal.present();
  }

  protected readonly ClubRank = ClubRank;
  protected readonly UserType = UserType;
}
