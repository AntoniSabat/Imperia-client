import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../models/user.model";

@Component({
  selector: 'app-manage-user-item',
  templateUrl: './manage-user-item.component.html',
  styleUrls: ['./manage-user-item.component.scss'],
})
export class ManageUserItemComponent implements OnInit {
  @Input() user!: User;

  constructor() { }

  ngOnInit() {
    console.log(this.user)
  }
}
