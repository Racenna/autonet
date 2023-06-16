import { configureStore } from "@reduxjs/toolkit";

import { userReducer } from "./user";
import { authApi } from "./services/auth";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { userApi } from "./services/user";
import { friendRequestApi } from "./services/friendRequest";
import { friendshipApi } from "./services/friendship";
import { chatApi } from "./services/chat";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [friendRequestApi.reducerPath]: friendRequestApi.reducer,
    [friendshipApi.reducerPath]: friendshipApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      authApi.middleware,
      userApi.middleware,
      friendRequestApi.middleware,
      friendshipApi.middleware,
      chatApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
