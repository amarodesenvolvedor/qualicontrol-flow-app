
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff, Loader2, RefreshCcw } from "lucide-react";

interface OfflineAlertProps {
  retryAttempt: number;
  maxRetryAttempts: number;
  isLoading: boolean;
  onRetry: () => void;
}

export const OfflineAlert = ({
  retryAttempt,
  maxRetryAttempts,
  isLoading,
  onRetry,
}: OfflineAlertProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <WifiOff className="h-4 w-4 mr-2" />
      <div className="flex flex-row items-center justify-between w-full">
        <AlertDescription>
          Não foi possível conectar ao servidor. Verifique sua conexão de internet.
          {retryAttempt > 0 && ` (Tentativa ${retryAttempt}/${maxRetryAttempts})`}
        </AlertDescription>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="ml-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCcw className="h-3 w-3 mr-1" />
          )}
          Tentar novamente
        </Button>
      </div>
    </Alert>
  );
};
