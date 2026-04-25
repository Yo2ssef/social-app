import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { RouterProvider } from "react-router";
import { myRouter } from "./Routing/AppRouter";
import AuthContext from "./Context/AuthContext/AuthContext";
import "react-loading-skeleton/dist/skeleton.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Offline } from "react-detect-offline";
import { WifiOff, X } from "lucide-react";
import { Toaster } from "react-hot-toast";
import NotificationProvider from "./Context/NotificationContext/NotificationContext";
import OfflineCard from "./Components/OfflineCard/OfflineCard";

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
    <Offline>
      <OfflineCard />
    </Offline>
  </StrictMode>,
);
