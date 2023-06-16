import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ToastContainer } from "react-toastify";
import { useGetMeMutation } from "./redux/services/user";
import { Layout } from "./components/Layout/Layout";
import { Path } from "./const/enums";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Error404 } from "./pages/Error404";
import { FullScreenLoader } from "./shared/components/FullscreenLoader";
import { isAuthorized } from "./utils/isAuthorized";
import MessagePage from "./pages/MessagePage/MessagePage";
import { HomePage } from "./pages/HomePage";
import { useGetNewTokenMutation } from "./redux/services/user/userApi";

function App() {
  const [getMe, { isLoading, isError, error }] = useGetMeMutation();
  const [getNewToken] = useGetNewTokenMutation();

  useEffect(() => {
    if (isAuthorized()) {
      getMe();
    }
  }, []);

  useEffect(() => {
    if (isError && (error as any).status === 401) {
      getNewToken({
        refreshToken: localStorage.getItem("refresh_token") ?? "",
      });
    }
  }, [isError]);

  if (isLoading) return <FullScreenLoader />;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />}>
            <Route path="/messages/:friendId" element={<MessagePage />} />
          </Route>
          <Route path={Path.SIGN_IN} element={<SignIn />} />
          <Route path={Path.SIGN_UP} element={<SignUp />} />
        </Route>
        <Route path={Path.ANY_ROUTE} element={<Error404 />} />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;
