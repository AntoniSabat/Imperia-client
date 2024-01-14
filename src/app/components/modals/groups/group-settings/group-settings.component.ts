import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Group} from "../../../../models/club.model";
import {ModalController} from "@ionic/angular";
import {ClubsService} from "../../../../services/clubs.service";
import {Router} from "@angular/router";
import {EditClubFieldComponent} from "../../clubs/edit-club-field/edit-club-field.component";

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss'],
})
export class GroupSettingsComponent  implements OnInit {
  @Input() clubId! :string;
  @Input() groupId!: string;
  group$!: BehaviorSubject<Group>;

  constructor(private modalCtrl: ModalController, public clubsService: ClubsService, private router: Router) { }

  ngOnInit() {
    this.group$ = new BehaviorSubject<Group>(this.clubsService.getGroup(this.clubId, this.groupId));
  }

  async back() {
    await this.modalCtrl.dismiss(null, 'close');
  }

  async editGroupInfo(field: string) {
    const modal = await this.modalCtrl.create({
      component: EditClubFieldComponent,
      componentProps: {
        clubId: this.clubId,
        field: field
      }
    })
    await modal.present();
  }

  async removeGroup() {
    // await this.clubsService.removeGroup(this.club$.getValue().id);
    await this.modalCtrl.dismiss('close');
  }
}
