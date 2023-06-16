export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export interface IUser {
  Profile: IProfile;
}

export interface IProfile {
  Name: string;
  Surname: string;
  Email: string;
  Birthday: string;
  Avatarimage: string;
  Description: string;
  sex: Gender;
}

export interface IGetUserResponse {
  profile: IProfileLowerCase;
}

export interface IGetNewTokenResponse {
  refresh_token: string;
  accessKey: string;
}

export interface IGetNewTokenRequest {
  refreshToken: string;
}

export interface IUserListItem {
  id: number;
  profile: IProfileLowerCase;
}

export interface IProfileLowerCase {
  name: string;
  surname: string;
  email: string;
  birthday: string;
  avatarImage: string;
  description: string;
  sex: Gender;
}
