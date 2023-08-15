import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.scss'],
})
export class AddAnnouncementComponent  implements OnInit {
  toAll = false;
  tempItems = [1,2,3,4,5]

  messageToAllUsers() {
    this.toAll = !this.toAll;
  }

  ngOnInit() {}

}
