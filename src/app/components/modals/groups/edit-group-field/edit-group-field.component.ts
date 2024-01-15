import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Club, Group} from "../../../../models/club.model";
import {ModalController} from "@ionic/angular";
import {ClubsService} from "../../../../services/clubs.service";

@Component({
  selector: 'app-edit-group-field',
  templateUrl: './edit-group-field.component.html',
  styleUrls: ['./edit-group-field.component.scss'],
})
export class EditGroupFieldComponent  implements OnInit {
  @Input() clubId!: string;
  @Input() groupId!: string;
  @Input() field = '';
  group$!: BehaviorSubject<Group>;
  name!: string;
  description!: string;

  constructor(private modalCtrl: ModalController, private clubsService: ClubsService) { }

  ngOnInit() {
    this.group$ = new BehaviorSubject<Group>(this.clubsService.getGroup(this.clubId, this.groupId));
    this.name = this.clubsService.getGroup(this.clubId, this.groupId).name;
    this.description = this.clubsService.getGroup(this.clubId, this.groupId).description;
  }

  async back() {
    await this.modalCtrl.dismiss();
  }

  async editData() {
    await this.clubsService.updateGroup(this.clubId, this.groupId, this.name, this.description);
    await this.modalCtrl.dismiss();
  }
}
