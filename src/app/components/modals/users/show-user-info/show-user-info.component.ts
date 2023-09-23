import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UsersService} from "../../../../services/users.service";
import {ClubsService} from "../../../../services/clubs.service";

@Component({
  selector: 'app-show-user-info',
  templateUrl: './show-user-info.component.html',
  styleUrls: ['./show-user-info.component.scss'],
})
export class ShowUserInfoComponent implements OnInit {
  @Input() clubId: string = "";
  @Input() groupId: string = "";
  @Input() uuid!: string;
  @Input() level!: string;

  constructor(private modalCtrl: ModalController, public usersService: UsersService, private clubsService: ClubsService) { }

  async back() {
    await this.modalCtrl.dismiss();
  }

  ngOnInit() {}

  async removeUser() {
    if (confirm("Are you sure you want to remove user from club?")) {
      await this.clubsService.removeUserFromClub(this.clubId, this.uuid);
      await this.modalCtrl.dismiss();
    }
  }

  async removeUserFromGroup() {
    if (confirm('Are you sure you want to remove user from group?')) {
      await this.clubsService.removeUserFromGroup(this.clubId, this.groupId, this.uuid);
      await this.modalCtrl.dismiss();
    }
  }
}
