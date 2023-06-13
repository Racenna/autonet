import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./const/routes";

const router = createBrowserRouter(routes);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
