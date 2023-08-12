import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UsersService, UserType} from "../../../services/users.service";
import {Router} from "@angular/router";
import {ClubsService} from "../../../services/clubs.service";
import {Club} from "../../../models/club.model";

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent  implements OnInit {
  userData: {name: string, surname: string, email: string, type: UserType | string, clubsAmount: number, clubs: Club[]} = {
    name: '',
    surname: '',
    email: '',
    type: '',
    clubsAmount: 0,
    clubs: []
  }

  constructor(private modalCtrl: ModalController, private usersService: UsersService, private router: Router, private clubsService: ClubsService) { }

  async ngOnInit() {
    await this.whoAmI();
  }

  async whoAmI() {
    const response = this.usersService.getActiveUser();
    this.userData.name = response.name;
    this.userData.surname = response.surname;
    this.userData.email = response.email;
    this.userData.clubsAmount = response.clubs.length;
    this.userData.type = response.type;

    response.clubs.map(async (club: string) => {
      const res = await this.clubsService.getClubInfo(club);
      this.userData.clubs.push(res.data);
    });
  }

  async goBackHome() {
    await this.modalCtrl.dismiss(null, 'back');
  }

  async goToSettings() {
    await this.modalCtrl.dismiss(null, 'back');
    await this.router.navigate(['settings'])
  }

  protected readonly UserType = UserType;
}
