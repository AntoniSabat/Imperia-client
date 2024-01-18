import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users.service";
import {ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import { ClubsService } from 'src/app/services/clubs.service';
import { ConversationsService } from 'src/app/services/conversations.service';
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
      await this.router.navigate(['start'], {
        replaceUrl: true
      })

    await this.clubsService.loadTodayLessons();
  }
  showAnnouncementDetails() {
    console.log('pokazuje szczegóły ogłoszenia')
  }

  async goToCalendar() {
    await this.router.navigate(['tabs', 'calendar']);
  }
  async goToPayments() {
    await this.router.navigate(['tabs', 'payments'])
  }
}
