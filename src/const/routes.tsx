import { RouteObject } from "react-router";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { Error404 } from "../pages/Error404";

export const routes: RouteObject[] = [
  { path: "/signIn", element: <SignIn /> },
  { path: "/signUp", element: <SignUp /> },
  { path: "*", element: <Error404 /> },
];
