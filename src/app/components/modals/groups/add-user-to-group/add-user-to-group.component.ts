import { Component, OnInit } from '@angular/core';
import {ClubsService} from "../../../../services/clubs.service";
import {UsersService} from "../../../../services/users.service";
import {User} from "../../../../models/user.model";
import {InfiniteScrollCustomEvent, ModalController} from "@ionic/angular";
import {BehaviorSubject, debounceTime, distinctUntilChanged} from "rxjs";
import {Group} from "../../../../models/club.model";

@Component({
  selector: 'app-add-user-to-group',
  templateUrl: './add-user-to-group.component.html',
  styleUrls: ['./add-user-to-group.component.scss'],
})
export class AddUserToGroupComponent  implements OnInit {
  activeGroup$ = this.clubsService.activeGroup$;
  activeClub$ = this.clubsService.activeClub$;
  usersData$ = this.usersService.usersData$;

  checkedUsers: Set<string> = new Set();
  searchedUsers$ = new BehaviorSubject<User[]>([]);

  user$ = this.usersService.user$;
  input$ = new BehaviorSubject<string>('');
  getUser = this.usersService.getUser;
  getGroup = this.clubsService.getGroup;

  constructor(private clubsService: ClubsService, private usersService: UsersService, private modalCtrl: ModalController) { }

  async back() {
    await this.modalCtrl.dismiss('refresh');
  }

  async ngOnInit() {
    await this.usersService.addUsersData(this.activeClub$.getValue().users.map(user => user.uuid));
    this.input$.pipe(
      // debounceTime(400),
      distinctUntilChanged()
    ).subscribe((input: string) => {
      const group = this.getGroup(this.activeGroup$.getValue());
      const users = [...group.admins, ...group.participants];
      this.searchedUsers$.next(this.activeClub$.getValue().users
        .map((user: any) => this.getUser(user.uuid))
        .filter(user => `${user.name} ${user.surname}`.toLowerCase().includes(input.toLowerCase()) && user.uuid != this.user$.getValue().uuid && !users.includes(user.uuid))
      )
    })
  }

  async handleCheckedUsers(ev: any, uuid: string | undefined) {
    if (!uuid) return;
    if (ev.target.checked)
      this.checkedUsers.add(uuid);
    else
      this.checkedUsers.delete(uuid);
  }

  async searchUser(e: any) {
    this.input$.next(e.target.value);
  }

  async addToGroup() {
    await this.clubsService.addUsersToGroup([...this.checkedUsers]);
    await this.modalCtrl.dismiss('added');
  }

  onIonInfinite(ev: any) {
    this.generateUsers();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500)
  }

  generateUsers() {
    const count = this.searchedUsers$.getValue().length + 1;
    // for (let i = 0; i < 25; i++)
      // this.searchedUsers$.next()
  }
}
