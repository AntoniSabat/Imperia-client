import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnnouncementComponent} from "../../components/announcements/announcement/announcement.component";
import {IonicModule} from "@ionic/angular";


@NgModule({
  declarations: [AnnouncementComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [AnnouncementComponent]
})
export class SharedModule { }
