import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {NgSelectModule} from "@ng-select/ng-select";

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfileDetailsComponent } from "./components/profile/profile-details/profile-details.component";
import { PersonalInfoComponent } from "./components/profile/edit-personal-info/personal-info.component";
import {ClubInfoComponent} from "./components/clubs/club-info/club-info.component";
import {ShowClubUsersComponent} from "./components/clubs/show-club-users/show-club-users.component";
import { AddAnnouncementComponent} from "./components/announcements/add-announcement/add-announcement.component";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {GroupInfoComponent} from "./components/groups/group-info/group-info.component";
import {AddUserToGroupComponent} from "./components/groups/add-user-to-group/add-user-to-group.component";
import { CreateConversationComponent } from './components/conversations/create-conversation/create-conversation.component';
import { ChatComponent } from './components/conversations/chat/chat.component';
import { ShowUsersComponent } from "./components/groups/show-users/show-users.component";
import {ManageUserItemComponent} from "./components/users/manage-user-item/manage-user-item.component";
import { ShowUserInfoComponent } from "./components/users/show-user-info/show-user-info.component";
import {EditClubFieldComponent} from "./components/clubs/edit-club-field/edit-club-field.component";
import {ChatInfoComponent} from "./components/conversations/chat-info/chat-info.component";
import {ClubSettingsComponent} from "./components/clubs/club-settings/club-settings.component";
import {GroupSettingsComponent} from "./components/groups/group-settings/group-settings.component";
import {EditGroupFieldComponent} from "./components/groups/edit-group-field/edit-group-field.component";
import {LessonInfoComponent} from "./components/calendar/lesson-info/lesson-info.component";

@NgModule({
  declarations: [
    AppComponent,
    ProfileDetailsComponent,
    PersonalInfoComponent,
    ClubInfoComponent,
    ShowClubUsersComponent,
    AddAnnouncementComponent,
    GroupInfoComponent,
    AddUserToGroupComponent,
    CreateConversationComponent,
    ChatComponent,
    ShowUsersComponent,
    ManageUserItemComponent,
    ShowUserInfoComponent,
    EditClubFieldComponent,
    ChatInfoComponent,
    ClubSettingsComponent,
    GroupSettingsComponent,
    EditGroupFieldComponent,
    LessonInfoComponent
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, NgSelectModule, HttpClientModule],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
