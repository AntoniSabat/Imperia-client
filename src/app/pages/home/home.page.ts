import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users.service";
import {ModalController} from "@ionic/angular";
import {ProfileDetailsComponent} from "../../components/modals/profile/profile-details/profile-details.component";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import { ClubsService } from 'src/app/services/clubs.service';
import { ConversationsService } from 'src/app/services/conversations.service';
import { User } from 'src/app/models/user.model';
import {checkImageUrl} from "../../utils";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user$ = this.usersService.user$;
  lessons$ = this.clubsService.todayLessons$;
  checkImageUrl = checkImageUrl;
  constructor(
    private usersService: UsersService,
    private modalCtrl: ModalController,
    private router: Router,
    private clubsService: ClubsService,
    private conversationsService: ConversationsService
  ) { }

  async ngOnInit() {
    if (!localStorage.getItem('auth'))
      this.router.navigate(['start'], {
        replaceUrl: true
      })

    await this.clubsService.loadTodayLessons();
  }
  showAnnouncementDetails() {
    console.log('pokazuje szczegóły ogłoszenia')
  }

  goToCalendar() {
    this.router.navigate(['tabs', 'calendar']);
  }
  goToPayments() {
    this.router.navigate(['tabs', 'payments'])
  }
}
