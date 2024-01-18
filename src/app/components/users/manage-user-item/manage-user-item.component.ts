import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../models/user.model";
import {UsersService} from "../../../services/users.service";
import {checkImageUrl, formatImageUrl} from "../../../utils";

@Component({
  selector: 'app-manage-user-item',
  templateUrl: './manage-user-item.component.html',
  styleUrls: ['./manage-user-item.component.scss'],
})
export class ManageUserItemComponent implements OnInit {
  @Input() clubId: string = '';
  @Input() groupId: string = '';
  @Input() user!: User;
  @Input() canManage = false;
  @Input() level = '';

  constructor(private usersService: UsersService) { }

  ngOnInit() {}

  async showUserInfo() {
    await this.usersService.showUserProfile(this.clubId, this.groupId, this.user.uuid, this.level);
  }

  protected readonly formatImageUrl = formatImageUrl;
  protected readonly checkImageUrl = checkImageUrl;
}
