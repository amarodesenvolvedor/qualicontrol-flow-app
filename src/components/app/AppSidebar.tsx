
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
  const getNavCls = ({
    isActive
  }: {
    isActive: boolean;
  }) => isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50";

  // Synchronize mobile menu open state with sidebar
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

  return <Sidebar className={collapsed && !isMobile ? "w-16" : "w-64"} collapsible="icon">
      <div className="flex items-center justify-between p-4 bg-sidebar border-b border-sidebar-border dark:bg-sidebar-dark">
        {(!collapsed || isMobile) && <span className="text-xl font-bold text-sidebar-foreground">IntegraQMS - SEW</span>}
        
        {isMobile ? <Button variant="ghost" size="icon" onClick={onMenuClose} className="self-end text-sidebar-foreground">
            <X className="h-5 w-5" />
          </Button> : <SidebarTrigger className="self-end text-sidebar-foreground" />}
      </div>

      <SidebarContent className="bg-sidebar dark:bg-sidebar-dark">
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end className={getNavCls} onClick={handleNavLinkClick}>
                    <Home className="mr-2 h-5 w-5" />
                    {(!collapsed || isMobile) && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/nao-conformidades" className={getNavCls} onClick={handleNavLinkClick}>
                    <ClipboardList className="mr-2 h-5 w-5" />
                    {(!collapsed || isMobile) && <span>Não Conformidades</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/auditorias" className={getNavCls} onClick={handleNavLinkClick}>
                    <FileSearch className="mr-2 h-5 w-5" />
                    {(!collapsed || isMobile) && <span>Auditorias</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/relatorios" className={getNavCls} onClick={handleNavLinkClick}>
                    <BarChart3 className="mr-2 h-5 w-5" />
                    {(!collapsed || isMobile) && <span>Relatórios</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Estatísticas</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/estatisticas" className={getNavCls} onClick={handleNavLinkClick}>
                    <PieChart className="mr-2 h-5 w-5" />
                    {(!collapsed || isMobile) && <span>Gráficos</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/exportar" className={getNavCls} onClick={handleNavLinkClick}>
                    <FileText className="mr-2 h-5 w-5" />
                    {(!collapsed || isMobile) && <span>Exportar Dados</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/configuracoes" className={getNavCls} onClick={handleNavLinkClick}>
                    <Settings className="mr-2 h-5 w-5" />
                    {(!collapsed || isMobile) && <span>Configurações</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/ajuda" className={getNavCls} onClick={handleNavLinkClick}>
                    <HelpCircle className="mr-2 h-5 w-5" />
                    {(!collapsed || isMobile) && <span>Ajuda</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}

export default AppSidebar;
