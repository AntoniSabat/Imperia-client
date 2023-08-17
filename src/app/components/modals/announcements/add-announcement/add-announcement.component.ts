import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ClubsService} from "../../../../services/clubs.service";
import {Club} from "../../../../models/club.model";
import {BehaviorSubject} from "rxjs";
import {ModalController} from "@ionic/angular";
import {ClubNewsType} from "../../../../models/announcement.model";

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.scss'],
})
export class AddAnnouncementComponent  implements OnInit {
  constructor(private clubsService: ClubsService, private cdr: ChangeDetectorRef, private modalCtrl: ModalController) {}

  title!: string;
  message!: string;
  toAll = false;
  selectedClubs: Club[] = [];
  clubs$: BehaviorSubject<Club[]> = this.clubsService.clubs$;
  clubsUsers: any[] = [];
  usersWhoGetsMessage: string[] = [];

  async messageToAllUsers() {
    this.toAll = !this.toAll;
  }

  async ngOnInit() {
    await this.clubsService.loadClubs();
  }

  async getClubsUsers() {
    this.selectedClubs.map(async(club: Club) => {
      const response = await this.clubsService.getClubInfo(club.id);
      this.clubsUsers.push(...response?.data?.users);
      this.cdr.detectChanges();
    })
  }

  async chosenClubs() {
    await this.getClubsUsers();
  }

  chosenUsers() {
    const checkboxes = Array.from(document.querySelectorAll('ion-checkbox.user'));
    checkboxes.forEach((checkbox: any) => {
      if (checkbox.checked) {
        this.usersWhoGetsMessage.push(checkbox.value)
      }
    })
  }

  async addAnnouncement() {
    console.log(this.usersWhoGetsMessage)
    const type = this.toAll ? ClubNewsType.BROADCAST : ClubNewsType.SELECTED;

    let clubs: Club[] = [];
    if (this.toAll)
      clubs = this.clubs$.getValue();
    else
      clubs = this.selectedClubs;

    const recipents = this.usersWhoGetsMessage;

    clubs.map(async(club: Club) => {
      await this.clubsService.addAnnouncement(club.id, {title: this.title, message: this.message, type: type, recipents});
    })

    await this.modalCtrl.dismiss();
  }
}
