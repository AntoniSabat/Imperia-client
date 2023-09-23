import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Conversation} from "../../../../models/conversation.model";
import {ConversationsService} from "../../../../services/conversations.service";

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss'],
})
export class ChatInfoComponent implements OnInit {
  @Input() conversationId!: string;
  conversation$ = new BehaviorSubject<Conversation>(this.conversationService.initialConversationValue);

  constructor(private conversationService: ConversationsService) { }

  async loadConversation(conversations: Conversation[]) {
    const conv = conversations.find((conversation) => conversation.id == this.conversationId);
    if (conv)
      this.conversation$.next(conv)
  }

  async ngOnInit() {
    await this.loadConversation(this.conversationService.conversations$.getValue());
    this.conversationService.conversations$.subscribe((conversations) => this.loadConversation(conversations));
  }
}
