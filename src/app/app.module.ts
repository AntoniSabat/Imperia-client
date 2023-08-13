import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfileDetailsComponent } from "./components/modals/profile-details/profile-details.component";
import { PersonalInfoComponent } from "./components/modals/personal-info/personal-info.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [AppComponent, ProfileDetailsComponent, PersonalInfoComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
