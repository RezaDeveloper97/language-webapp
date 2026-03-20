import { RouterProvider } from "react-router-dom";
import { router } from "../router.jsx";
import { SettingsProvider } from "./SettingsProvider.jsx";

export function AppProviders() {
  return (
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  );
}
