import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import routes from "@/routes/Routes.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import Toaster from "@/provider/toaster-provider.jsx";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./index.css";
import Store from "@/store/store.js";
import { Provider } from "react-redux";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={Store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <RouterProvider router={routes} />
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  </QueryClientProvider>,
);
