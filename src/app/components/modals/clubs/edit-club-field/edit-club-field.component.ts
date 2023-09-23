import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ClubsService} from "../../../../services/clubs.service";

@Component({
  selector: 'app-edit-club-field',
  templateUrl: './edit-club-field.component.html',
  styleUrls: ['./edit-club-field.component.scss'],
})
export class EditClubFieldComponent  implements OnInit {
  @Input() clubId!: string;
  @Input() field = '';

  name: string = this.clubsService.getClub(this.clubId).name;
  description: string = this.clubsService.getClub(this.clubId).description;

  constructor(private modalCtrl: ModalController, private clubsService: ClubsService) { }

  ngOnInit() {
    this.name = this.clubsService.getClub(this.clubId).name;
    this.description = this.clubsService.getClub(this.clubId).description;
  }

  async back() {
    await this.modalCtrl.dismiss();
  }

  async editData() {
    await this.clubsService.updateClubInfo(this.clubId, this.name, this.description);
    await this.modalCtrl.dismiss();
  }
}
