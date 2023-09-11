import {Component, Input, OnInit} from '@angular/core';
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
export class AddUserToGroupComponent implements OnInit {
  @Input() clubId!: string;
  @Input() groupId!: string;

  usersData$ = this.usersService.usersData$;

  group$ = new BehaviorSubject<Group>(this.clubsService.initialGroupValue)
  checkedUsers: Set<string> = new Set();
  searchedUsers$ = new BehaviorSubject<User[]>([]);

  user$ = this.usersService.user$;
  input$ = new BehaviorSubject<string>('');
  getUser = this.usersService.getUser;

  constructor(private clubsService: ClubsService, private usersService: UsersService, private modalCtrl: ModalController) { }

  async back() {
    await this.modalCtrl.dismiss('refresh');
  }

  formarUuid(user: User) {
    return user?.uuid ?? "";
  }

  async ngOnInit() {
    await this.usersService.addUsersData(this.clubsService.getClub(this.clubId).users.map(user => user.uuid));
    this.input$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((input: string) => {
      const group = this.clubsService.getGroup(this.clubId, this.groupId);
      const users = [...group.admins, ...group.participants];
      this.searchedUsers$.next(this.clubsService.getClub(this.clubId).users
        .map((user: any) => this.getUser(user.uuid))
        .filter(user => `${user.name} ${user.surname}`.toLowerCase().includes(input.toLowerCase()) && user.uuid != this.user$.getValue().uuid && !users.includes(user.uuid))
      )
    })
    this.clubsService.clubs$.subscribe(() => this.group$.next(this.clubsService.getGroup(this.clubId, this.groupId)))
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
    await this.clubsService.addUsersToGroup(this.clubId, this.groupId, [...this.checkedUsers]);
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
