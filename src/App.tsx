import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { routes } from "./const/routes";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter(routes);

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ToastContainer />
      <RouterProvider router={router} />
    </LocalizationProvider>
  );
}

export default App;
