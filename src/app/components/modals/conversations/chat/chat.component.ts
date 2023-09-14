import {Component, Input, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import {Conversation, Message, MessageType} from 'src/app/models/conversation.model';
import { ConversationsService } from 'src/app/services/conversations.service';
import {UsersService} from "../../../../services/users.service";
import {ChatInfoComponent} from "../chat-info/chat-info.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() conversationId!: string;

  conversations$ = this.conversationsService.conversations$;
  conversation = new BehaviorSubject<Conversation>(this.conversationsService.initialConversationValue);

  msgInput: string = '';

  constructor(
    private modalCtrl: ModalController,
    private conversationsService: ConversationsService,
    private usersService: UsersService
  ) {}

  getFullname(uuid: string) {
    const user = this.usersService.getUser(uuid);
    return `${user.name} ${user.surname}`;
  }

  async ngOnInit() {
    this.conversationsService.loadMessages(this.conversationId, 0, 10);
    this.conversation.next(this.conversations$.getValue().find((conversation) => conversation.id == this.conversationId) ?? this.conversationsService.initialConversationValue)
  }

  async goBackHome() {
    await this.modalCtrl.dismiss(null, 'back');
  }

  async sendMessage() {
    this.conversationsService.sendConversationMessage(this.conversationId, -1, MessageType.MESSAGE, this.msgInput);
    console.log(this.msgInput)
    this.msgInput = '';
  }

  async openInfo() {
    const modal = await this.modalCtrl.create({
      component: ChatInfoComponent,
      componentProps: {
        conversationId: this.conversationId
      }
    });
    await modal.present();
  }
}
