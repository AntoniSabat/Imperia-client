import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfileDetailsComponent } from "./components/modals/profile-details/profile-details.component";
import { PersonalInfoComponent } from "./components/modals/edit-personal-info/personal-info.component";
import { ClubInfoComponent } from "./components/modals/clubs/club-info/club-info.component";
import { ShowClubUsersComponent } from "./components/modals/clubs/show-club-users/show-club-users.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [AppComponent, ProfileDetailsComponent, PersonalInfoComponent, ClubInfoComponent, ShowClubUsersComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
