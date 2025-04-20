import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AuthProviderWithDeps } from "./hooks/use-auth";

createRoot(document.getElementById("root")!).render(
  <AuthProviderWithDeps>
    <TooltipProvider>
      <Toaster />
      <App />
    </TooltipProvider>
  </AuthProviderWithDeps>
);
