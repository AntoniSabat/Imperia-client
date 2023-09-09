import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ClubsService} from "../../../../services/clubs.service";

@Component({
  selector: 'app-edit-club-field',
  templateUrl: './edit-club-field.component.html',
  styleUrls: ['./edit-club-field.component.scss'],
})
export class EditClubFieldComponent  implements OnInit {
  club$ = this.clubsService.activeClub$;
  @Input() field = '';

  constructor(private modalCtrl: ModalController, private clubsService: ClubsService) { }

  ngOnInit() {}

  async back() {
    await this.modalCtrl.dismiss();
  }

  async editData() {
    await this.clubsService.updateClubInfo(this.club$.getValue().id, this.club$.getValue().name, this.club$.getValue().description);
    await this.modalCtrl.dismiss();
  }
}
