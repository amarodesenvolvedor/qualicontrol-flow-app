
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConnectivityHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRetry: () => void;
}

export const ConnectivityHelpDialog = ({
  open,
  onOpenChange,
  onRetry,
}: ConnectivityHelpDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Problemas de Conexão</DialogTitle>
          <DialogDescription>
            Não foi possível conectar ao servidor. Aqui estão algumas dicas para resolver o problema:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Verifique sua conexão com a internet</h4>
            <p className="text-sm text-muted-foreground">
              Certifique-se de que seu dispositivo está conectado à internet. Tente acessar outros sites para confirmar se sua conexão está funcionando.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">2. Verifique seu firewall ou VPN</h4>
            <p className="text-sm text-muted-foreground">
              Se você está usando um firewall ou VPN, eles podem estar bloqueando a conexão. Tente desativá-los temporariamente.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">3. Limpe o cache do navegador</h4>
            <p className="text-sm text-muted-foreground">
              Problemas de cache podem interferir na autenticação. Tente limpar o cache do seu navegador.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">4. Tente outro navegador</h4>
            <p className="text-sm text-muted-foreground">
              Se o problema persistir, tente acessar o sistema usando outro navegador.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onRetry}>
            Tentar novamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
