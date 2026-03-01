import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { RouterProvider } from "react-router";
import { myRouter } from "./Routing/AppRouter";
import toast, { Toaster } from "react-hot-toast";
import AuthContext from "./Context/AuthContext/AuthContext";
import "react-loading-skeleton/dist/skeleton.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Offline } from "react-detect-offline";
import { Xrp } from "iconsax-reactjs";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <AuthContext>
        <HeroUIProvider>
          <RouterProvider router={myRouter} />
          <Toaster position="top-center" reverseOrder={true} />
        </HeroUIProvider>
      </AuthContext>
    </QueryClientProvider>
    <Offline>
      <div className="flex gap-2.5 bg-white rounded-3xl top-10 p-2 fixed left-1/2 -translate-x-1/2 items-center z-55">
        <span className="bg-red-600 p-1.5 rounded-full">
          <Xrp size="15" color="#FFFFFF" />
        </span>
        <span className="text-red-500 font-bold">you are offline</span>
      </div>
    </Offline>
  </StrictMode>,
);
