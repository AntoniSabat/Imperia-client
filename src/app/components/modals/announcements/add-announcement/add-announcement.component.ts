import { Component, OnInit } from '@angular/core';
import {ClubsService} from "../../../../services/clubs.service";
import {Club} from "../../../../models/club.model";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.scss'],
})
export class AddAnnouncementComponent  implements OnInit {
  constructor(private clubsService: ClubsService) {}

  toAll = false;
  selectedClubs: Club[] = [];
  clubs$: BehaviorSubject<Club[]> = this.clubsService.clubs$;

  async messageToAllUsers() {
    this.toAll = !this.toAll;
  }

  async getClubs() {
    await this.clubsService.loadClubs();
    const response = await this.clubsService.getClubs();
  }

  test() {
    console.log(this.selectedClubs);
  }

  async ngOnInit() {
    await this.getClubs();
    console.log(this.clubs$.getValue())
  }
}
