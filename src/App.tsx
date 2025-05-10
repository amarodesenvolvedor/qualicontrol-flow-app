
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/app/ProtectedRoute";
import Index from "./pages/Index";
import NonConformancesPage from "./pages/NonConformancesPage";
import NewNonConformancePage from "./pages/NewNonConformancePage";
import AuditsPage from "./pages/AuditsPage";
import ReportsPage from "./pages/ReportsPage";
import StatisticsPage from "./pages/StatisticsPage";
import ExportPage from "./pages/ExportPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/nao-conformidades" element={
              <ProtectedRoute>
                <NonConformancesPage />
              </ProtectedRoute>
            } />
            <Route path="/nao-conformidades/nova" element={
              <ProtectedRoute>
                <NewNonConformancePage />
              </ProtectedRoute>
            } />
            <Route path="/auditorias" element={
              <ProtectedRoute>
                <AuditsPage />
              </ProtectedRoute>
            } />
            <Route path="/relatorios" element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/estatisticas" element={
              <ProtectedRoute>
                <StatisticsPage />
              </ProtectedRoute>
            } />
            <Route path="/exportar" element={
              <ProtectedRoute>
                <ExportPage />
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
