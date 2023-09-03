export interface Message {
    id: number;
    uuid: string;
    replied: number;
    removed: boolean;
    message: {
        type: MessageType;
        content: string;
    }
}

export enum MessageType {
    IMAGE = 'IMAGE',
    MESSAGE = 'MESSAGE',
}
  
export enum ConversationType {
    GROUP = 'GROUP',
    FACE_TO_FACE = 'FACE_TO_FACE',
}

export interface Conversation {
    id: string;
    name: string;
    admins: string[];
    uuids: string[];
    messages: Message[];
    type: ConversationType;
}