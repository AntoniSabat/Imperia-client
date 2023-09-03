import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Message, MessageType } from 'src/app/models/conversation.model';
import { ConversationsService } from 'src/app/services/conversations.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  conversations$ = this.conversationsService.conversations$;
  messages$ = this.conversationsService.messages$
  msgInput: string = '';
  id = this.conversationsService.activeConversation;
  conversation = this.conversations$.getValue().find((conversation) => conversation.id == this.id);

  constructor(
    private modalCtrl: ModalController,
    private conversationsService: ConversationsService
  ) { }

  async ngOnInit() {
    await this.conversationsService.loadMessages(0, 10);
  }

  async goBackHome() {
    this.id = null;
    await this.modalCtrl.dismiss(null, 'back');
  }

  async sendMessage() {
    this.conversationsService.sendConversationMessage(this.id ?? '', -1, MessageType.MESSAGE, this.msgInput);
    console.log(this.msgInput)
    this.msgInput = '';
  }
}
