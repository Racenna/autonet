import { IProfileLowerCase } from "../user";

export interface IGetAllFriendResponse {
  id: number;
  senderId: number;
  receiverId: number;
  sender: {
    profile: IProfileLowerCase;
    id: number;
  };
  receiver: {
    profile: IProfileLowerCase;
    id: number;
  };
}
