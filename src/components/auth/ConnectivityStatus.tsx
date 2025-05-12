
import { Loader2, WifiOff, Wifi } from "lucide-react";

interface ConnectivityStatusProps {
  status: 'checking' | 'online' | 'offline';
  onHelpClick?: () => void;
}

export const ConnectivityStatus = ({ status, onHelpClick }: ConnectivityStatusProps) => {
  return (
    <div className="mb-4 flex items-center justify-center">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm 
        ${status === 'online' ? 'bg-green-100 text-green-800' : 
        status === 'offline' ? 'bg-red-100 text-red-800' : 
        'bg-yellow-100 text-yellow-800'}`}>
        {status === 'online' ? (
          <>
            <Wifi className="h-3 w-3" />
            <span>Conectado</span>
          </>
        ) : status === 'offline' ? (
          <>
            <WifiOff className="h-3 w-3" />
            <span>Desconectado</span>
          </>
        ) : (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Verificando conexão...</span>
          </>
        )}
      </div>
    </div>
  );
};
