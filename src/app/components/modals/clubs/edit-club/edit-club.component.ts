import { Component, OnInit, Input } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {EditClubFieldComponent} from "../edit-club-field/edit-club-field.component";
import {ClubsService} from "../../../../services/clubs.service";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {Club} from "../../../../models/club.model";

@Component({
  selector: 'app-edit-club',
  templateUrl: './edit-club.component.html',
  styleUrls: ['./edit-club.component.scss'],
})
export class EditClubComponent implements OnInit {
  @Input() clubId!: string;
  club$ = new BehaviorSubject<Club>(this.clubsService.getClub(this.clubId));
  constructor(private modalCtrl: ModalController, private clubsService: ClubsService, private router: Router) { }

  ngOnInit() {
    this.clubsService.clubs$.subscribe(() => this.club$.next(this.clubsService.getClub(this.clubId)))
  }

  async back() {
    await this.modalCtrl.dismiss();
  }

  async editClubInfo(field: string) {
    const modal = await this.modalCtrl.create({
      component: EditClubFieldComponent,
      componentProps: {
        clubId: this.clubId,
        field: field
      }
    })
    await modal.present();
  }

  async removeClub() {
    await this.clubsService.removeClub(this.club$.getValue().id);
    await this.modalCtrl.dismiss('close');
  }
}
