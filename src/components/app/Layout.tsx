
import { useEffect, useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Bell, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { toast } = useToast();
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  // Notification example
  const showNotification = () => {
    toast({
      title: "Nova notificação",
      description: "Não conformidade #NC-2023-42 recebeu uma atualização",
    });
  };

  return (
    <SidebarProvider collapsedWidth={64}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="h-16 border-b flex items-center justify-between px-6 bg-card shadow-sm">
            <h1 className="text-lg sm:text-xl font-semibold text-primary">
              Sistema de Gerenciamento de Não Conformidades
            </h1>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={showNotification}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className={cn(
            "flex-1 overflow-auto p-6", 
            "transition-all duration-300",
          )}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
