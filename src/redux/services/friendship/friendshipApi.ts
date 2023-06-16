import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { Method } from "../types/request";
import { setListOfFriends } from "../../user/userSlice";
import { IGetFriendshipListResponse } from "../types/friendship";

const BASE_URL = process.env.REACT_APP_BASE_URL as string;

export const friendshipApi = createApi({
  reducerPath: "friendshipApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/friendship`,
  }),
  endpoints: (builder) => ({
    // prettier-ignore
    getFriendsList: builder.query<IGetFriendshipListResponse[], string | void>({
      query(search) {
        return {
          url: "/",
          method: Method.GET,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessKey") ?? ""}`,
          },
          params: {
            request: search ?? ''
          }
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setListOfFriends(data));
        } catch (error) {
          console.error(
            "friendshipApi-getFriendsList-onQueryStarted_error:",
            error
          );
        }
      },
    }),
  }),
});

export const { useGetFriendsListQuery, useLazyGetFriendsListQuery } =
  friendshipApi;
