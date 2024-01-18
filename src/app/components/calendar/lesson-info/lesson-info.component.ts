import {Component, Input, OnInit} from '@angular/core';
import {Lessons} from "../../../models/lessons.model";
import {ModalController} from "@ionic/angular";
import {UsersService} from "../../../services/users.service";

@Component({
  selector: 'app-lesson-info',
  templateUrl: './lesson-info.component.html',
  styleUrls: ['./lesson-info.component.scss'],
})
export class LessonInfoComponent  implements OnInit {
  @Input() lesson!: Lessons;

  constructor(private modalCtrl: ModalController, public usersService: UsersService) { }

  ngOnInit() {
    console.log(this.lesson);
  }

  async back() {
    await this.modalCtrl.dismiss();
  }
}
