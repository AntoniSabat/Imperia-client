import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfileDetailsComponent } from 'src/app/components/modals/profile/profile-details/profile-details.component';
import { UsersService } from 'src/app/services/users.service';
import {BehaviorSubject} from "rxjs";
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { ConversationsService } from 'src/app/services/conversations.service';
import { CreateConversationComponent } from 'src/app/components/modals/conversations/create-conversation/create-conversation.component';
import { ChatComponent } from 'src/app/components/modals/conversations/chat/chat.component';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.page.html',
  styleUrls: ['./messenger.page.scss'],
})
export class MessengerPage implements OnInit {
  userImageSrc = '';
  shouldDisplayImage$ = new BehaviorSubject<Boolean>(false);
  user$ = this.usersService.user$;
  conversations$ = this.conversationsService.conversations$;

  constructor(
    private readonly usersService: UsersService,
    private readonly modalCtrl: ModalController,
    private readonly conversationsService: ConversationsService
  ) { }

  async ngOnInit() {
    await this.whoAmI();

    // this.conversations$.subscribe(
    //   (conversations) => {
    //     this.openChat(conversations[0]?.id ?? null)
    //   }
    // )
  }

  async whoAmI() {
    this.user$.subscribe(
      (user: User) => {
        this.userImageSrc = environment.apiBaseUrl + '/files/' + user.profileImage;
        this.shouldDisplayImage$.next(this.checkImageUrl(this.userImageSrc));
      }
    )
    await this.usersService.loadActiveUser();
  }


  checkImageUrl(url: string) {
    if (!url) return false;
    else {
      const pattern = new RegExp('^https?:\\/\\/.+\\.(png|jpg|jpeg|bmg|gif|webp)$', 'i');
      return pattern.test(url);
    }
  }

  async showProfileDetails() {
    const modal = await this.modalCtrl.create({
      component: ProfileDetailsComponent
    });
    await modal.present();
  }

  async createConversation() {
    const modal = await this.modalCtrl.create({
      component: CreateConversationComponent
    });
    await modal.present();
  }

  async openChat(id: string | null) {
    await this.usersService.addUsersData(
      this.conversations$.getValue()
      .map(c => {return {id: c.id, uuids: [...c.admins, ...c.uuids]}})
      .find(c => c.id == id)?.uuids ?? []
    );
    const modal = await this.modalCtrl.create({
      component: ChatComponent,
      componentProps: {
        conversationId: id
      }
    })
    await modal.present()
  }
}
