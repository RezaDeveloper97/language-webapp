import { RouterProvider } from "react-router-dom";
import { router } from "../router.jsx";
import { SettingsProvider } from "./SettingsProvider.jsx";
import { I18nProvider } from "./I18nProvider.jsx";

export function AppProviders() {
  return (
    <SettingsProvider>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </SettingsProvider>
  );
}
