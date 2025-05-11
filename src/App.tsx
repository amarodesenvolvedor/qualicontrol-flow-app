
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/app/ProtectedRoute";
import Index from "./pages/Index";
import NonConformancesPage from "./pages/NonConformancesPage";
import NewNonConformancePage from "./pages/NewNonConformancePage";
import NonConformanceDetailsPage from "./pages/NonConformanceDetailsPage";
import NonConformanceEditPage from "./pages/NonConformanceEditPage";
import AuditsPage from "./pages/AuditsPage";
import ReportsPage from "./pages/ReportsPage";
import StatisticsPage from "./pages/StatisticsPage";
import ExportPage from "./pages/ExportPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <AuthProvider>
      <Toaster />
      <Sonner />
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
        <Route path="/nao-conformidades/:id" element={
          <ProtectedRoute>
            <NonConformanceDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/nao-conformidades/:id/editar" element={
          <ProtectedRoute>
            <NonConformanceEditPage />
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
    </AuthProvider>
  </TooltipProvider>
);

export default App;
