import { useEffect } from "react";
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
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  const [getMe, { isLoading, isError, error }] = useGetMeMutation();
  const [getNewToken] = useGetNewTokenMutation();

  useEffect(() => {
    if (isAuthorized()) {
      getMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isError && (error as any).status === 401) {
      getNewToken({
        refreshToken: localStorage.getItem("refresh_token") ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  if (isLoading) return <FullScreenLoader fullScreen />;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ToastContainer />
      <Routes>
        <Route path={Path.HOME} element={<Layout />}>
          <Route path={Path.HOME} element={<HomePage />}>
            <Route
              path={`${Path.MESSAGES}/:chatId`}
              element={<MessagePage />}
            />
            <Route path={Path.PROFILE} element={<ProfilePage />} />
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
