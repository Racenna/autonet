import { IProfile } from "../user";

export interface IRegisterUserBodyRequest {
  Login: string;
  Password: string;
  Profile: IProfile;
}

export interface ILoginUserBodyRequest {
  Login: string;
  Password: string;
  IsNeedToRemember: boolean;
}

export interface IBaseResponse {
  status: string;
}

export interface ILoginUserResponse extends IBaseResponse {
  accessKey: string;
  refresh_token: string;
}
