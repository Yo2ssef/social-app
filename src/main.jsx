import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { RouterProvider } from "react-router";
import { myRouter } from "./Routing/AppRouter";
import AuthContext from "./Context/AuthContext/AuthContext";
import "react-loading-skeleton/dist/skeleton.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import NotificationProvider from "./Context/NotificationContext/NotificationContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <NotificationProvider>
        <AuthContext>
          <HeroUIProvider>
            <RouterProvider router={myRouter} />
            <Toaster position="top-center" reverseOrder={true} />
          </HeroUIProvider>
        </AuthContext>
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>,
);
