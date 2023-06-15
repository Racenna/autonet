import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IGetUserResponse } from "../types/user";
import { setUser } from "../../user/userSlice";
import { Method } from "../types/request";

const BASE_URL = process.env.REACT_APP_BASE_URL as string;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/user`,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.mutation<IGetUserResponse, null>({
      query() {
        return {
          url: "/",
          method: Method.GET,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessKey")}`,
          },
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
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
          console.error("userApi-getMe-onQQueryStarted_error:", error);
        }
      },
    }),
  }),
});

export const { useGetMeMutation } = userApi;
