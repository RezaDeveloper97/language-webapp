import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../shared/layouts/AppLayout.jsx";
import { HomePage } from "../pages/HomePage/HomePage.jsx";
import { SettingsPage } from "../pages/SettingsPage/SettingsPage.jsx";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "settings", element: <SettingsPage /> },
      ],
    },
  ],
  { basename: "/learning-language" }
);
