import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Club, Group} from "../../../../models/club.model";
import {ModalController} from "@ionic/angular";
import {ClubsService} from "../../../../services/clubs.service";
import {Router} from "@angular/router";
import {EditGroupFieldComponent} from "../edit-group-field/edit-group-field.component";

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss'],
})
export class GroupSettingsComponent  implements OnInit {
  @Input() clubId! :string;
  @Input() groupId!: string;
  club$!: BehaviorSubject<Club>;
  group$!: BehaviorSubject<Group>;

  constructor(private modalCtrl: ModalController, public clubsService: ClubsService, private router: Router) { }

  ngOnInit() {
    this.group$ = new BehaviorSubject<Group>(this.clubsService.getGroup(this.clubId, this.groupId));
    this.club$ = new BehaviorSubject<Club>(this.clubsService.getClub(this.clubId));
    this.clubsService.clubs$.subscribe(() => this.group$.next(this.clubsService.getGroup(this.clubId, this.groupId)))
  }

  async back() {
    await this.modalCtrl.dismiss(null, 'close');
  }

  async editGroupInfo(field: string) {
    const modal = await this.modalCtrl.create({
      component: EditGroupFieldComponent,
      componentProps: {
        clubId: this.clubId,
        groupId: this.groupId,
        field: field
      }
    })
    await modal.present();

    const {data} = await modal.onDidDismiss();
    if (data === 'close') {
      await this.modalCtrl.dismiss();
    }
  }

  async removeGroup() {
    await this.clubsService.removeGroup(this.clubId, this.groupId);
    await this.modalCtrl.dismiss('close');
  }
}
