import {Component, Input, OnInit} from '@angular/core';
import {ClubsService} from "../../../../services/clubs.service";
import {ModalController} from "@ionic/angular";
import {UsersService} from "../../../../services/users.service";
import {BehaviorSubject} from "rxjs";
import {User} from "../../../../models/user.model";
import {Club} from "../../../../models/club.model";

@Component({
  selector: 'app-show-club-users',
  templateUrl: './show-club-users.component.html',
  styleUrls: ['./show-club-users.component.scss'],
})
export class ShowClubUsersComponent implements OnInit {
  @Input() clubId!: string;
  club$ = new BehaviorSubject<Club>(this.clubsService.getClub(this.clubId))
  usersData$ = this.usersService.usersData$;
  users$ = new BehaviorSubject<User[]>([]);

  constructor(private clubsService: ClubsService, private modalCtrl: ModalController, private usersService: UsersService) {}

  async ngOnInit() {
    this.usersData$.subscribe(() => {
      this.users$.next(this.clubsService.getClub(this.clubId).users.map(user => user.uuid).map(uuid => this.usersService.getUser(uuid)))
    })
    this.clubsService.clubs$.subscribe(() => this.club$.next(this.clubsService.getClub(this.clubId)))
    await this.usersService.addUsersData(this.clubsService.getClub(this.clubId).users.map(user => user.uuid));
  }

  async back() {
    await this.modalCtrl.dismiss();
  }
}
