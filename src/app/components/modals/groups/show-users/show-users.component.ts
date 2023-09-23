import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ClubsService} from "../../../../services/clubs.service";
import {UsersService} from "../../../../services/users.service";
import {BehaviorSubject} from "rxjs";
import { User } from "../../../../models/user.model";
import {Group} from "../../../../models/club.model";

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.scss'],
})
export class ShowUsersComponent implements OnInit {
  @Input() clubId!: string;
  @Input() groupId!: string;

  group$ = new BehaviorSubject<Group>(this.clubsService.getGroup(this.clubId, this.groupId))
  usersData$ = this.usersService.usersData$;
  users$ = new BehaviorSubject<User[]>([]);

  constructor(private modalCtrl: ModalController, private clubsService: ClubsService, private usersService: UsersService) { }

  loadUsers() {
    this.users$.next([...this.group$.getValue().admins, ...this.group$.getValue().participants].map(uuid => this.usersService.getUser(uuid)));
  }

  async ngOnInit() {
    this.usersData$.subscribe(() => this.loadUsers())
    this.group$.subscribe(() => this.loadUsers())
    await this.usersService.addUsersData(this.clubsService.getClub(this.clubId).users.map(user => user.uuid));
    this.clubsService.clubs$.subscribe(() => {
      this.group$.next(this.clubsService.getGroup(this.clubId, this.groupId))
    })
  }

  async back() {
    await this.modalCtrl.dismiss()
  }
}
