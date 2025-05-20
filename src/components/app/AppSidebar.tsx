
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, ClipboardList, PieChart, Settings, Home, FileText, FileSearch, HelpCircle, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppSidebarProps {
  isMobileMenuOpen?: boolean;
  onMenuClose?: () => void;
}

export function AppSidebar({
  isMobileMenuOpen,
  onMenuClose
}: AppSidebarProps) {
  const {
    state,
    setOpenMobile
  } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const isActive = (path: string) => currentPath === path;

  // Função para obter classes de navegação com base no estado ativo
  const getNavCls = ({
    isActive
  }: {
    isActive: boolean;
  }) => isActive 
    ? "sidebar-item sidebar-item-active" 
    : "sidebar-item sidebar-item-hover";

  // Sincronizar estado do menu mobile com a sidebar
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(!!isMobileMenuOpen);
    }
  }, [isMobileMenuOpen, isMobile, setOpenMobile]);
  
  const handleNavLinkClick = () => {
    if (isMobile && onMenuClose) {
      onMenuClose();
    }
  };

  return (
    <Sidebar 
      className={collapsed && !isMobile ? "w-16 transition-all duration-300" : "w-64 transition-all duration-300"} 
      collapsible="icon"
    >
      <div className="flex items-center justify-between p-4 bg-[hsl(var(--sidebar-header-bg))] border-b border-[hsl(var(--sidebar-border))]">
        {(!collapsed || isMobile) && (
          <span className="text-xl font-bold text-[hsl(var(--sidebar-header-text))]">IntegraQMS - SEW</span>
        )}
        
        {isMobile ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClose} 
            className="self-end text-[hsl(var(--sidebar-foreground))]"
          >
            <X className="h-5 w-5" />
          </Button>
        ) : (
          <SidebarTrigger className="self-end text-[hsl(var(--sidebar-foreground))]" />
        )}
      </div>

      <SidebarContent className="bg-[hsl(var(--sidebar-background))]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[hsl(var(--sidebar-group-text))]">Principal</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end className={getNavCls} onClick={handleNavLinkClick}>
                    <Home className="sidebar-icon" />
                    {(!collapsed || isMobile) && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/nao-conformidades" className={getNavCls} onClick={handleNavLinkClick}>
                    <ClipboardList className="sidebar-icon" />
                    {(!collapsed || isMobile) && <span>Não Conformidades</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/auditorias" className={getNavCls} onClick={handleNavLinkClick}>
                    <FileSearch className="sidebar-icon" />
                    {(!collapsed || isMobile) && <span>Auditorias</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/relatorios" className={getNavCls} onClick={handleNavLinkClick}>
                    <BarChart3 className="sidebar-icon" />
                    {(!collapsed || isMobile) && <span>Relatórios</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[hsl(var(--sidebar-group-text))]">Estatísticas</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/estatisticas" className={getNavCls} onClick={handleNavLinkClick}>
                    <PieChart className="sidebar-icon" />
                    {(!collapsed || isMobile) && <span>Gráficos</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/exportar" className={getNavCls} onClick={handleNavLinkClick}>
                    <FileText className="sidebar-icon" />
                    {(!collapsed || isMobile) && <span>Exportar Dados</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[hsl(var(--sidebar-group-text))]">Sistema</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/configuracoes" className={getNavCls} onClick={handleNavLinkClick}>
                    <Settings className="sidebar-icon" />
                    {(!collapsed || isMobile) && <span>Configurações</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/ajuda" className={getNavCls} onClick={handleNavLinkClick}>
                    <HelpCircle className="sidebar-icon" />
                    {(!collapsed || isMobile) && <span>Ajuda</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
