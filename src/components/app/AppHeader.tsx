
import { Button } from "@/components/ui/button";
import { Bell, MoonIcon, SunIcon, Menu } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AppHeaderProps {
  toggleTheme: () => void;
  theme: "light" | "dark";
  toggleMobileMenu: () => void;
  isMobile: boolean;
}

const AppHeader = ({ 
  toggleTheme, 
  theme, 
  toggleMobileMenu, 
  isMobile 
}: AppHeaderProps) => {
  const { toast } = useToast();

  // Notification example
  const showNotification = () => {
    toast({
      title: "Nova notificação",
      description: "Não conformidade #NC-2023-42 recebeu uma atualização",
    });
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6 bg-card shadow-sm dark:bg-card dark:border-border">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleMobileMenu}
          className="mr-2 sm:mr-4 md:flex lg:flex"
          aria-label="Menu de navegação"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <h1 className="text-lg sm:text-xl font-semibold text-primary truncate">
          Sistema de Gerenciamento
        </h1>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={showNotification}
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Mudar para modo escuro" : "Mudar para modo claro"}
        >
          {theme === "light" ? (
            <MoonIcon className="h-5 w-5" />
          ) : (
            <SunIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
