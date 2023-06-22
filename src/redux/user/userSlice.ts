import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser, IUserListItem } from "../services/types/user";
import { IGetAllFriendResponse } from "../services/types/friendRequest";
import { IGetFriendshipListResponse } from "../services/types/friendship";
import { IChatResponse } from "../services/types/chat";

export interface UserState {
  user: IUser | null;
  isAuthorized: boolean;
  listOfUsers: IUserListItem[];
  listOfRequests: IGetAllFriendResponse[];
  listOfFriends: IGetFriendshipListResponse[];
  listOfChats: IChatResponse[];
  activeChat: IChatResponse | null;
  isEditProfile: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthorized: false,
  listOfUsers: [],
  listOfRequests: [],
  listOfFriends: [],
  listOfChats: [],
  activeChat: null,
  isEditProfile: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem("accessKey");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("currentRoute");

      return initialState;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthorized = true;
    },
    setListOfUsers: (state, action: PayloadAction<IUserListItem[]>) => {
      state.listOfUsers = action.payload;
    },
    setListOfRequests: (
      state,
      action: PayloadAction<IGetAllFriendResponse[]>
    ) => {
      state.listOfRequests = action.payload;
    },
    setListOfFriends: (
      state,
      action: PayloadAction<IGetFriendshipListResponse[]>
    ) => {
      state.listOfFriends = action.payload;
    },
    setListOfChats: (state, action: PayloadAction<IChatResponse[]>) => {
      state.listOfChats = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<IChatResponse | null>) => {
      state.activeChat = action.payload;
    },
    changeUpdateState: (state, action: PayloadAction<boolean>) => {
      state.isEditProfile = action.payload;
    },
  },
});

export const {
  logout,
  setUser,
  setListOfUsers,
  setListOfRequests,
  setListOfFriends,
  setListOfChats,
  setActiveChat,
  changeUpdateState,
} = userSlice.actions;

export default userSlice.reducer;
