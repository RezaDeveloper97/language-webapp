import { RouterProvider } from "react-router-dom";
import { router } from "../router.jsx";

export function AppProviders() {
  return <RouterProvider router={router} />;
}
