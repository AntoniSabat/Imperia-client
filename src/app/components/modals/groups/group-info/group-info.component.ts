import {ChangeDetectorRef, Component, ElementRef, Input, OnInit} from '@angular/core';
import {IonInput, ModalController} from "@ionic/angular";
import {ClubsService} from "../../../../services/clubs.service";
import {AddUserToGroupComponent} from "../add-user-to-group/add-user-to-group.component";
import {UsersService} from "../../../../services/users.service";
import {BehaviorSubject, debounceTime, distinctUntilChanged} from "rxjs";
import {User} from "../../../../models/user.model";
import { ShowUsersComponent } from "../show-users/show-users.component";
import {Group} from "../../../../models/club.model";
import {group} from "@angular/animations";
import {checkImageUrl, formatImageUrl} from "../../../../utils";

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss'],
})
export class GroupInfoComponent implements OnInit {
  @Input() clubId!: string;
  @Input() groupId!: string;

  checkedUsers: Set<string> = new Set();
  searchedUsers$ = new BehaviorSubject<User[]>([]);

  user$ = this.usersService.user$;
  input$ = new BehaviorSubject<string>('');

  group$ = new BehaviorSubject<Group>(this.clubsService.getGroup(this.clubId, this.groupId));
  usersData$= this.usersService.usersData$;
  limitedGroupUsers$ = new BehaviorSubject<User[]>([]);
  constructor(private modalCtrl: ModalController, private clubsService: ClubsService, private usersService: UsersService) { }

  async loadLimitedUsers() {
    const group = this.clubsService.getGroup(this.clubId, this.groupId);
    const groupUsers = [...group.admins, ...group.participants].map(uuid => this.usersService.getUser(uuid)).sort((a, b) => a.surname.localeCompare(b.surname));
    if (groupUsers.length > 5)
      groupUsers.length = 5;
    this.limitedGroupUsers$.next(groupUsers);
  }

  async ngOnInit() {
    await this.usersService.addUsersData([...this.clubsService.getClub(this.clubId).groups.find(group => group.id == this.groupId)?.participants ?? [], ...this.clubsService.getClub(this.clubId).users.map(user => user.uuid)]);
    this.usersData$.subscribe(() => this.loadLimitedUsers());
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe((input: string) => {
      const group = this.clubsService.getGroup(this.clubId, this.groupId);
      const users = [...group.admins, ...group.participants];
      this.searchedUsers$.next(this.clubsService.getClub(this.clubId).users
        .map((user: any) => this.usersService.getUser(user.uuid))
        .filter(user => `${user.name} ${user.surname}`.toLowerCase().includes(input.toLowerCase()) && user.uuid != this.user$.getValue().uuid && !users.includes(user.uuid))
      )
    })
    this.clubsService.clubs$.subscribe(() => {
      this.loadLimitedUsers();
      this.group$.next(this.clubsService.getGroup(this.clubId, this.groupId));
    })
  }

  async back() {
    await this.modalCtrl.dismiss();
  }

  editGroup() {

  }

  formatUuid(user: User) {
    return user?.uuid ?? "";
  }

  async addUsers() {
    const modal = await this.modalCtrl.create({
      component: AddUserToGroupComponent,
      componentProps: {
        clubId: this.clubId,
        groupId: this.groupId
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
  }

  async seeAllGroupUsersModal() {
    const modal = await  this.modalCtrl.create({
      component: ShowUsersComponent,
      componentProps: {
        clubId: this.clubId,
        groupId: this.groupId
      }
    })
    await modal.present();
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
    await this.modalCtrl.dismiss();
    this.checkedUsers.clear();
    this.searchedUsers$.next([]);
  }

  protected readonly checkImageUrl = checkImageUrl;
  protected readonly formatImageUrl = formatImageUrl;
}
