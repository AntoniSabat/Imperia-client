import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss'],
})
export class GroupInfoComponent  implements OnInit {
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  async back() {
    await this.modalCtrl.dismiss();
  }
}
