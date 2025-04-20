import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RealtimeProvider } from "@/hooks/use-realtime";
import { configureQueryClient, setupAutoRefetching } from "@/lib/queryEnhancer";

// Create a client with enhanced configuration for real-time updates
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true, // Enable refetching when window regains focus
      refetchOnReconnect: true, // Enable refetching when network reconnects
      staleTime: 10 * 1000, // Consider data stale after 10 seconds
    },
  },
});

// Configure the query client for optimal real-time updates
configureQueryClient(queryClient);

// Set up automatic refetching for critical data
setupAutoRefetching(queryClient);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RealtimeProvider>
        <TooltipProvider>
          <Toaster />
          <App />
        </TooltipProvider>
      </RealtimeProvider>
    </AuthProvider>
  </QueryClientProvider>
);
