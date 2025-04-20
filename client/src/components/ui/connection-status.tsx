import { useRealtime } from "@/hooks/use-realtime";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const { isConnected } = useRealtime();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-1.5", className)}>
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-xs font-medium">
              {isConnected ? "Connected" : "Offline"}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isConnected
            ? "Real-time updates are active"
            : "You're offline. Changes may not be reflected immediately."}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}