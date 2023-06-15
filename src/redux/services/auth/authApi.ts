import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import {
  IRegisterUserBodyRequest,
  IBaseResponse,
  ILoginUserResponse,
  ILoginUserBodyRequest,
} from "../types/auth";
import { Method } from "../types/request";
import { userApi } from "../user";

const BASE_URL = process.env.REACT_APP_BASE_URL as string;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/user`,
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<IBaseResponse, IRegisterUserBodyRequest>({
      query(data) {
        return {
          url: "/",
          method: Method.POST,
          body: data,
        };
      },
    }),
    loginUser: builder.mutation<ILoginUserResponse, ILoginUserBodyRequest>({
      query(data) {
        return {
          url: "/login",
          method: Method.POST,
          body: data,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { accessKey, refresh_token },
          } = await queryFulfilled;
          localStorage.setItem("accessKey", accessKey);
          localStorage.setItem("refresh_token", refresh_token);
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.error("authApi-loginUser-onQueryStarted_error:", error);
        }
      },
    }),
    logoutUser: builder.mutation<IBaseResponse, void>({
      query() {
        return {
          url: "/logout",
          method: Method.POST,
        };
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = authApi;
