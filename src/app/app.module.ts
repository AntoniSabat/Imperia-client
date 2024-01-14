import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {NgSelectModule} from "@ng-select/ng-select";

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfileDetailsComponent } from "./components/modals/profile/profile-details/profile-details.component";
import { PersonalInfoComponent } from "./components/modals/profile/edit-personal-info/personal-info.component";
import { ClubInfoComponent } from "./components/modals/clubs/club-info/club-info.component";
import { ShowClubUsersComponent } from "./components/modals/clubs/show-club-users/show-club-users.component";
import { AddAnnouncementComponent} from "./components/modals/announcements/add-announcement/add-announcement.component";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {GroupInfoComponent} from "./components/modals/groups/group-info/group-info.component";
import {AddUserToGroupComponent} from "./components/modals/groups/add-user-to-group/add-user-to-group.component";
import { CreateConversationComponent } from './components/modals/conversations/create-conversation/create-conversation.component';
import { ChatComponent } from './components/modals/conversations/chat/chat.component';
import { ShowUsersComponent } from "./components/modals/groups/show-users/show-users.component";
import {ManageUserItemComponent} from "./components/modals/users/manage-user-item/manage-user-item.component";
import { ShowUserInfoComponent } from "./components/modals/users/show-user-info/show-user-info.component";
import { EditClubComponent} from "./components/modals/clubs/edit-club/edit-club.component";
import { EditClubFieldComponent } from "./components/modals/clubs/edit-club-field/edit-club-field.component";
import {ChatInfoComponent} from "./components/modals/conversations/chat-info/chat-info.component";
import {ClubSettingsComponent} from "./components/clubs/club-settings/club-settings.component";

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
    EditClubComponent,
    EditClubFieldComponent,
    ChatInfoComponent,
    ClubSettingsComponent
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, NgSelectModule, HttpClientModule],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
