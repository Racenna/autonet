import { RouteObject } from "react-router";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { Error404 } from "../pages/Error404";

import { Path } from "./enums";
import { Layout } from "../components/Layout/Layout";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: Path.SIGN_IN, element: <SignIn /> },
      { path: Path.SIGN_UP, element: <SignUp /> },
    ],
  },
  { path: Path.ANY_ROUTE, element: <Error404 /> },
];
