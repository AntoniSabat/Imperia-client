import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import * as io from 'socket.io-client';
import {BehaviorSubject, tap} from "rxjs";
import {Conversation, ConversationType, Message, MessageType} from "../models/conversation.model";
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user.model";
import {logIn} from "ionicons/icons";

@Injectable({
    providedIn: 'root'
})
export class ConversationsService {
    private socket;
    searchedUsers$ = new BehaviorSubject<Partial<User>[]>([]);
    conversations$ = new BehaviorSubject<Conversation[]>([]);
    initialConversationValue: Conversation = {id: '', name: '', admins: [], uuids: [], messages: [], type: ConversationType.GROUP}

    getConversation(id: string) {
      return this.conversations$.getValue().find(c => c.id == id) ?? this.initialConversationValue;
    }

    constructor(private http: HttpClient) {
        this.conversations$.subscribe((obj) => console.log('info', obj))
        const auth = localStorage.getItem('auth');

        this.socket = io.connect(environment.apiWsUrl, {
            extraHeaders: auth ? {Authorization: `Bearer ${auth}`} : {}
        });

        this.socket.on('error', (data) => {
            console.log('error:', data);
        });

        this.socket.on('updatedConversation', (data) => {
            console.log('updatedConversation:', data);
        });

        this.socket.on('deletedConversation', (data) => {
            this.conversations$.next(this.conversations$.getValue().filter(conversation => conversation.id != data.id))
        });

        this.socket.on('newConversation', (data) => {
            console.log('newConversation:', data);
            this.conversations$.next([data, ...this.conversations$.getValue()]);
        });

        this.socket.on('removedConversationMessage', (data) => {
            console.log('removedConversationMessage:', data);
        });

        this.socket.on('conversations', (data) => {
            console.log('conversations:', data);
            this.conversations$.next(data);
        });

        this.socket.on('messages', (data) => {
            console.log('messages:', data);

            try {
                const conversation: Conversation | undefined = this.conversations$.getValue().find(c => c.id = data.id);

                if (!conversation)
                  return;

                const messages: Message[] = conversation.messages;
                const newMessages: Message[] = data.messages[0].messages;

                if (!messages || !newMessages) return;

                if (messages?.length > 0) {
                    const map = new Map<number, Message>();

                    messages.forEach(message => {
                        map.set(message.id, message);
                    });

                    newMessages.forEach(message => {
                        map.set(message.id, message);
                    });

                    conversation.messages = [...Array.from(map.values()).sort((a, b) => a.id - b.id)];
                } else {
                  conversation.messages = newMessages;
                }
                this.conversations$.next([...this.conversations$.getValue().filter(c => c.id != data.id), conversation]);
            } catch {}
        });

        this.sendMessage('getConversations');
    }

    async loadSearchUsers(text: string) {
        const auth = localStorage.getItem('auth');

        this.http.post<Partial<User>[]>(environment.apiBaseUrl + '/conversations/searchUsers', {
            text: text
        }, {
            headers: auth ? {Authorization: `Bearer ${auth}`} : {}
        }).pipe(
            tap((users: Partial<User>[]) => this.searchedUsers$.next(users))
        ).subscribe();
    }

    loadMessages(id: string, skip: number, limit: number) {
        this.sendMessage('getMessages', {
            id,
            skip,
            limit
        })
    }

    sendMessage(event: string, message: any = {}) {
        this.socket.emit(event, message);
    }

    sendConversationMessage(id: string, replied: number, type: MessageType, content: string) {
        this.sendMessage('sendConversationMessage', {
            id,
            replied,
            type,
            content
        })
    }
}
