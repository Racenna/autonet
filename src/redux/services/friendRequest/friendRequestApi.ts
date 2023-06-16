import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { Method } from "../types/request";
import { IGetAllFriendResponse } from "../types/friendRequest";
import { setListOfRequests } from "../../user/userSlice";

const BASE_URL = process.env.REACT_APP_BASE_URL as string;

export const friendRequestApi = createApi({
  reducerPath: "friendRequestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/friendRequest`,
  }),
  endpoints: (builder) => ({
    sendFriendRequest: builder.mutation<void, number>({
      query(id) {
        return {
          url: "/",
          method: Method.POST,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessKey") ?? ""}`,
          },
          params: {
            receiverId: id,
          },
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(
            friendRequestApi.endpoints.getFriendRequests.initiate()
          );
        } catch (error) {
          console.error(
            "friendRequestApi-sendFriendRequest-onQueryStarted_error:",
            error
          );
        }
      },
    }),
    getFriendRequests: builder.query<IGetAllFriendResponse[], void>({
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
          dispatch(setListOfRequests(data));
        } catch (error) {
          console.error(
            "friendRequestApi-getFriendRequests-onQueryStarted_error:",
            error
          );
        }
      },
    }),
    acceptRequest: builder.mutation<void, number>({
      query(id) {
        return {
          url: `/accept/${id}`,
          method: Method.POST,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessKey") ?? ""}`,
          },
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(
            friendRequestApi.endpoints.getFriendRequests.initiate()
          );
        } catch (error) {
          console.error(
            "friendRequestApi-acceptRequest-onQueryStarted_error:",
            error
          );
        }
      },
    }),
    declineRequest: builder.mutation<void, number>({
      query(id) {
        return {
          url: `/${id}`,
          method: Method.DELETE,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessKey") ?? ""}`,
          },
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(
            friendRequestApi.endpoints.getFriendRequests.initiate()
          );
        } catch (error) {
          console.error(
            "friendRequestApi-declineRequest-onQueryStarted_error:",
            error
          );
        }
      },
    }),
  }),
});

export const {
  useSendFriendRequestMutation,
  useAcceptRequestMutation,
  useDeclineRequestMutation,
  useGetFriendRequestsQuery,
} = friendRequestApi;
