import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UsersService, UserType} from "../../../../services/users.service";
import {Router} from "@angular/router";
import {ClubsService} from "../../../../services/clubs.service";
import {Club} from "../../../../models/club.model";

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
  user$ = this.usersService.user$;
  clubs: Club[] = [];

  constructor(private modalCtrl: ModalController, private usersService: UsersService, private router: Router, private clubsService: ClubsService) { }

  async ngOnInit() {
    await this.whoAmI();
  }

  async whoAmI() {
    await this.usersService.loadActiveUser();
    const user = this.usersService.getActiveUser();

    this.user$.getValue().clubs.map(async (clubID: string) => {
      const club = await this.clubsService.getClubInfo(clubID);
      this.clubs.push(club.data);
    });
  }

  async goBackHome() {
    await this.modalCtrl.dismiss(null, 'back');
  }

  async goToSettings() {
    await this.modalCtrl.dismiss(null, 'back');
    await this.router.navigate(['settings'])
  }
}
