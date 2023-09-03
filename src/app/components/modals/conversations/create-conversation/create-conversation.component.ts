import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ConversationType } from 'src/app/models/conversation.model';
import { ConversationsService } from 'src/app/services/conversations.service';

@Component({
  selector: 'app-create-conversation',
  templateUrl: './create-conversation.component.html',
  styleUrls: ['./create-conversation.component.scss'],
})
export class CreateConversationComponent implements OnInit {
  name$ = new BehaviorSubject<string>('')
  checkedUsers: Set<string> = new Set();
  userInput$ = new Subject<string>();
  searchedUsers$ = this.conversationsService.searchedUsers$;

  constructor(
    private modalCtrl: ModalController,
    private conversationsService: ConversationsService
  ) {}

  ngOnInit() {
    this.userInput$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(text => this.conversationsService.loadSearchUsers(text))
    this.conversationsService.loadSearchUsers('');
  }

  async search(event: any) {
    this.userInput$.next(event.target.value);
  }

  async handleCheckedUsers(ev: any, uuid: string | undefined) {
    if (!uuid) return;
    if (ev.target.checked)
      this.checkedUsers.add(uuid);
    else
      this.checkedUsers.delete(uuid);
  }

  async goBackHome() {
    await this.modalCtrl.dismiss(null, 'back');
  }

  async setName(ev: any) {
    this.name$.next(ev.target.value);
  }

  async create() {
    this.conversationsService.sendMessage('createConversation', {
      name: this.name$.getValue(),
      uuids: [...this.checkedUsers],
      type: this.checkedUsers.size == 1 ? ConversationType.FACE_TO_FACE : ConversationType.GROUP
    });
    this.modalCtrl.dismiss();
  }
}
