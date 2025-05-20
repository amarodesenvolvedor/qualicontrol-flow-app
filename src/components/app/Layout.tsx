
import { useEffect, useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import MainContent from "./MainContent";
import { useTheme } from "./ThemeProvider";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fechar menu mobile quando mudar para visualização desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-background transition-colors duration-300">
        <AppSidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          onMenuClose={() => setIsMobileMenuOpen(false)} 
        />
        <div className="flex flex-col flex-1">
          <AppHeader 
            toggleTheme={toggleTheme}
            theme={theme}
            toggleMobileMenu={toggleMobileMenu}
            isMobile={isMobile}
          />
          <MainContent>
            {children}
          </MainContent>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
