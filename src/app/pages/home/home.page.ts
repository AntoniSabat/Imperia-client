import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import axios from "axios";
import {UsersService} from "../../services/users.service";
import {ModalController} from "@ionic/angular";
import {ProfileDetailsComponent} from "../../components/modals/profile/profile-details/profile-details.component";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import { ClubsService } from 'src/app/services/clubs.service';
import { ConversationsService } from 'src/app/services/conversations.service';
import { User } from 'src/app/models/user.model';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userImageSrc = '';
  shouldDisplayImage$ = new BehaviorSubject<Boolean>(false);
  user$ = this.usersService.user$;
  lessons$ = this.clubsService.todayLessons$;
  constructor(private usersService: UsersService, private modalCtrl: ModalController, private router: Router, private clubsService: ClubsService, private conversationsService: ConversationsService) { }

  async ngOnInit() {
    await this.whoAmI();
    await this.clubsService.loadTodayLessons();
  }

  checkImageUrl(url: string) {
    if (!url) return false;
    else {
      const pattern = new RegExp('^https?:\\/\\/.+\\.(png|jpg|jpeg|bmg|gif|webp)$', 'i');
      return pattern.test(url);
    }
  }

  async whoAmI() {
    this.user$.subscribe(
      (user: User) => {
        this.userImageSrc = environment.apiBaseUrl + '/files/' + user.profileImage;
        this.shouldDisplayImage$.next(this.checkImageUrl(this.userImageSrc));
      }
    )
    await this.usersService.loadActiveUser();
  }

  async showProfileDetails() {
    const modal = await this.modalCtrl.create({
      component: ProfileDetailsComponent
    })
    await modal.present();
  }

  showAnnouncementDetails() {
    console.log('pokazuje szczegóły ogłoszenia')
  }

  goToCalendar() {
    this.router.navigate(['calendar']);
  }
  goToClubs() {
    this.router.navigate(['clubs']);
  }
  goToConversations() {
    this.router.navigate(['messenger']);
  }
  goToPayments() {
    this.router.navigate(['payments'])
  }
}
