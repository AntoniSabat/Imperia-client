import {Component, ViewChild} from '@angular/core';
import {UsersService} from "./services/users.service";
import {IonList} from "@ionic/angular";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  user$ = this.usersService.user$;

  public appPages = [
    { title: 'Home', url: '/tabs/home', icon: 'mail' },
    { title: 'Clubs', url: '/tabs/clubs', icon: 'basketball' },
    { title: 'Calendar', url: '/tabs/calendar', icon: 'calendar' },
    { title: 'Announcements', url: '/newses', icon: 'mail' },
    { title: 'Payments', url: '/tabs/payments', icon: 'cart' },
    { title: 'Chat', url: '/tabs/messenger', icon: 'chatbox-ellipses' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private readonly usersService: UsersService,
  ) {}
}
