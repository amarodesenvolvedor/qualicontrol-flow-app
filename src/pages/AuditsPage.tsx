
import { useState } from 'react';
import Layout from '@/components/app/Layout';
import { useAuditReports } from '@/hooks/useAuditReports';
import { useDepartments } from '@/hooks/useDepartments';
import { AuditReportList } from '@/components/audits/AuditReportList';
import { AuditFilters } from '@/components/audits/AuditFilters';
import { NewAuditForm } from '@/components/audits/NewAuditForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { AuditReportInput } from '@/types/audit';

const AuditsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { 
    auditReports, 
    isLoading, 
    filters, 
    setFilters, 
    createAuditReport, 
    deleteAuditReport,
    getYearsFromReports
  } = useAuditReports();

  const { data: departments = [] } = useDepartments();
  
  const years = getYearsFromReports(auditReports);

  const handleCreateAuditReport = (data: AuditReportInput, file: File) => {
    createAuditReport.mutate(
      { data, file },
      {
        onSuccess: () => setIsDialogOpen(false),
      }
    );
  };

  const handleDeleteAuditReport = (id: string) => {
    deleteAuditReport.mutate(id);
  };

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Relatórios de Auditoria</h1>
            <p className="text-muted-foreground">
              Gerencie e acesse os relatórios de auditoria da empresa
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Relatório
          </Button>
        </div>

        <AuditFilters 
          departments={departments} 
          years={years}
          filters={filters}
          onFilterChange={setFilters}
        />

        {isLoading ? (
          <div className="p-8 text-center">Carregando relatórios...</div>
        ) : (
          <AuditReportList 
            auditReports={auditReports} 
            onDelete={handleDeleteAuditReport} 
          />
        )}

        <NewAuditForm 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          departments={departments}
          onSubmit={handleCreateAuditReport}
          isSubmitting={createAuditReport.isPending}
        />
      </div>
    </Layout>
  );
};

export default AuditsPage;
