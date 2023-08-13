import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users.service";
import {Club} from "../../models/club.model";
import {ClubsService} from "../../services/clubs.service";

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.page.html',
  styleUrls: ['./clubs.page.scss'],
})
export class ClubsPage implements OnInit {
  clubs: Club[] = [];

  constructor(private usersService: UsersService, private clubsService: ClubsService) { }

  async ngOnInit() {
    await this.whoAmI();
  }

  async whoAmI() {
    const response = this.usersService.getActiveUser();
    response.clubs.map(async (club: string) => {
      const res = await this.clubsService.getClubInfo(club);
      this.clubs.push(res.data);
    });
  }

  showClubDetails() {

  }
}
