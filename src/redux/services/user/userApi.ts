import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import {
  IGetNewTokenRequest,
  IGetNewTokenResponse,
  IGetUserResponse,
  IUpdateProfile,
  IUserListItem,
} from "../types/user";
import { setListOfUsers, setUser } from "../../user/userSlice";
import { Method } from "../types/request";

const BASE_URL = process.env.REACT_APP_BASE_URL as string;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/user`,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.mutation<IGetUserResponse, void>({
      query() {
        return {
          url: "/",
          method: Method.GET,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessKey")}`,
          },
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { profile },
          } = await queryFulfilled;
          dispatch(
            setUser({
              Profile: {
                Avatarimage: profile.avatarImage,
                Birthday: profile.birthday,
                Description: profile.description,
                Email: profile.email,
                Name: profile.name,
                Surname: profile.surname,
                sex: profile.sex,
              },
            })
          );
        } catch (error) {
          console.error("userApi-getMe-onQueryStarted_error:", error);
        }
      },
    }),
    getNewToken: builder.mutation<IGetNewTokenResponse, IGetNewTokenRequest>({
      query(data) {
        return {
          url: "/new-token",
          method: Method.POST,
          params: {
            refreshToken: data.refreshToken,
          },
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { accessKey, refresh_token },
          } = await queryFulfilled;
          localStorage.setItem("accessKey", accessKey);
          localStorage.setItem("refresh_token", refresh_token);
          await dispatch(userApi.endpoints.getMe.initiate());
        } catch (error) {
          console.error("userApi-getNewToken-onQueryStarted_error:", error);
        }
      },
    }),
    getAllUsers: builder.query<IUserListItem[], void>({
      query() {
        return {
          url: "/all",
          method: Method.GET,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessKey")}`,
          },
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setListOfUsers(data));
        } catch (error) {
          console.error("userApi-getAllUsers-onQueryStarted_error:", error);
        }
      },
    }),
    updateProfileInfo: builder.mutation<void, IUpdateProfile>({
      query(profileInfo) {
        return {
          url: "/",
          method: Method.PUT,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessKey")}`,
          },
          body: profileInfo,
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getMe.initiate());
        } catch (error) {
          console.error(
            "userApi-updateProfileInfo-onQueryStarted_error:",
            error
          );
        }
      },
    }),
  }),
});

export const {
  useGetMeMutation,
  useGetNewTokenMutation,
  useGetAllUsersQuery,
  useUpdateProfileInfoMutation,
} = userApi;
