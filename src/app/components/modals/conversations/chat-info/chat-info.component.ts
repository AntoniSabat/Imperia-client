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

  async loadConversation() {
    this.conversation$.next(
      this.conversationService.conversations$.getValue()
      .find(c => c.id == this.conversationId) ?? this.conversationService.initialConversationValue
    );
  }

  async ngOnInit() {
    await this.loadConversation();
    this.conversationService.conversations$.subscribe(this.loadConversation);
  }
}
