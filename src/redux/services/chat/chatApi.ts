import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { Method } from "../types/request";
import { setActiveChat, setListOfChats } from "../../user/userSlice";
import { IChatResponse, IMessage } from "../types/chat";

const BASE_URL = process.env.REACT_APP_BASE_URL as string;

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/chat`,
  }),
  endpoints: (builder) => ({
    getAllChats: builder.query<IChatResponse[], void>({
      query() {
        return {
          url: "/",
          method: Method.GET,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessKey") ?? ""}`,
          },
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setListOfChats(data));
        } catch (error) {
          console.error("chatApi-getAllChats-onQueryStarted_error:", error);
        }
      },
    }),
    getChatById: builder.query<IMessage[], number | string>({
      query(chatId) {
        return {
          url: `/${chatId}`,
          method: Method.GET,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessKey") ?? ""}`,
          },
        };
      },
      async onQueryStarted(chatId, { dispatch, queryFulfilled }) {
        try {
          const { data: messages } = await queryFulfilled;
          const { data, isSuccess } = await dispatch(
            chatApi.endpoints.getAllChats.initiate()
          );

          if (data && isSuccess) {
            const activeChat = data.find(
              (chat) =>
                chat.chat.id === messages?.[0].chatId ||
                chat.chat.id === Number(chatId)
            );

            if (activeChat) dispatch(setActiveChat(activeChat));
          }
        } catch (error) {
          console.error("chatApi-getAllChats-onQueryStarted_error:", error);
        }
      },
    }),
    createChat: builder.query<void, number>({
      query(friendId) {
        return {
          url: "/",
          method: Method.POST,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessKey") ?? ""}`,
          },
          params: {
            secondUserId: friendId,
          },
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(chatApi.endpoints.getAllChats.initiate());
        } catch (error) {
          console.error("chatApi-createChat-onQueryStarted_error:", error);
        }
      },
    }),
  }),
});

export const {
  useLazyGetAllChatsQuery,
  useGetAllChatsQuery,
  useLazyCreateChatQuery,
  useCreateChatQuery,
  useLazyGetChatByIdQuery,
} = chatApi;
