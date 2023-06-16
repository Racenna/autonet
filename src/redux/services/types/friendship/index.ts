import { Gender } from "../user";

export interface IGetFriendshipListResponse {
  id: number;
  onlineStatus: number;
  profile: {
    name: string;
    surname: string;
    email: string;
    avatarImage: string;
    sex: Gender;
  };
}
