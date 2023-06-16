import { IGetFriendshipListResponse } from "../friendship";
import { Gender } from "../user";

export interface IChatResponse {
  chat: {
    id: number;
    firstUserId: number;
    secondUserId: number;
    firstUser: IUserChatInfo;
    secondUser: IUserChatInfo;
    messages: IMessage[];
  };
  lastMessage: {
    senderId: number;
    message: string;
    time: string;
    chatId: number;
    senderName: null;
    id: number;
  };
}

export interface IMessage {
  senderId: number;
  message: string;
  time: string;
  chatId: number;
  senderName: null;
  id: number;
}

export interface IUserChatInfo {
  id: number;
  friends: any[];
  profile: {
    id: number;
    name: string;
    surname: string;
    email: string;
    birthday: string;
    avatarImage: string;
    description: string;
    sex: Gender;
  };
}

export interface IFriendWithChat {
  friendInfo: IGetFriendshipListResponse;
  chat: IChatResponse | null;
}

export interface ISendMessage {
  SenderId: string;
  Time: string;
  Message: string;
}
