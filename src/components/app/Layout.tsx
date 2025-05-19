
import { useEffect, useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { Bell, MoonIcon, SunIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Notification example
  const showNotification = () => {
    toast({
      title: "Nova notificação",
      description: "Não conformidade #NC-2023-42 recebeu uma atualização",
    });
  };

  // Close mobile menu when changing to desktop view
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar isMobileMenuOpen={isMobileMenuOpen} onMenuClose={() => setIsMobileMenuOpen(false)} />
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6 bg-card shadow-sm">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMobileMenu}
                className="mr-2"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            )}
            <h1 className="text-lg sm:text-xl font-semibold text-primary truncate">
              Sistema de Gerenciamento
            </h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={showNotification}
              >
                <Bell className="h-5 w-5" />
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
            "flex-1 overflow-auto p-3 sm:p-6", 
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
