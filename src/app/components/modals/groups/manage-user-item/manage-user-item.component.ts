import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../models/user.model";
import {UsersService} from "../../../../services/users.service";

@Component({
  selector: 'app-manage-user-item',
  templateUrl: './manage-user-item.component.html',
  styleUrls: ['./manage-user-item.component.scss'],
})
export class ManageUserItemComponent implements OnInit {
  @Input() user!: User;
  @Input() canManage = false;

  constructor(private usersService: UsersService) { }

  ngOnInit() {}

  async showUserInfo() {
    await this.usersService.showUserProfile(this.user.uuid);
  }
}
