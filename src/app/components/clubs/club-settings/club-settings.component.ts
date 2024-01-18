import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Club} from "../../../models/club.model";
import {ModalController} from "@ionic/angular";
import {ClubsService} from "../../../services/clubs.service";
import {Router} from "@angular/router";
import {EditClubFieldComponent} from "../edit-club-field/edit-club-field.component";

@Component({
  selector: 'app-club-settings',
  templateUrl: './club-settings.component.html',
  styleUrls: ['./club-settings.component.scss'],
})
export class ClubSettingsComponent  implements OnInit {
  @Input() clubId!: string;
  club$!: BehaviorSubject<Club>;
  constructor(private modalCtrl: ModalController, private clubsService: ClubsService, private router: Router) { }

  ngOnInit() {
    this.club$ = new BehaviorSubject<Club>(this.clubsService.getClub(this.clubId));
    this.clubsService.clubs$.subscribe(() => this.club$.next(this.clubsService.getClub(this.clubId)))
  }

  async back() {
    await this.modalCtrl.dismiss(null, 'close');
  }

  async addTitle() {
    this.club$.getValue().titles.push({id: this.club$.getValue().titles.length+1, content: '', duration: ''})
  }


  defaultTitle!: number;
  async saveTitles() {
    await this.clubsService.addTitles(this.clubId, this.club$.getValue().titles);
    if (this.defaultTitle)
      await this.clubsService.setDefaultTitle(this.clubId, this.defaultTitle);
  }

  async deleteTitle(i: number) {
    this.club$.getValue().titles.splice(i, 1);
  }

  async createClubCode() {
    await this.clubsService.createClubCode(this.clubId);
  }

  async setDefaultTitle(i: number) {
    this.defaultTitle = this.club$.getValue().titles[i].id;
    console.log(this.defaultTitle)
  }

  async showClubCode() {
    const {status, data} = await this.clubsService.getClubCode(this.clubId);

    if (status == 'correct')
      alert(data?.code ?? "No code")
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
