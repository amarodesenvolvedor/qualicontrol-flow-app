import { useState } from 'react';
import { useScheduledAudits } from '@/hooks/useScheduledAudits';
import { useDepartments } from '@/hooks/useDepartments';
import { ScheduledAuditList } from './ScheduledAuditList';
import { NewScheduledAuditForm } from './NewScheduledAuditForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, X, AlertCircle } from 'lucide-react';
import { ScheduledAuditFilters } from './ScheduledAuditFilters';
import { ScheduledAuditInput } from '@/types/audit';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ScheduledAudits = () => {
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { departments } = useDepartments();
  
  const {
    scheduledAudits,
    isLoading,
    createScheduledAudit,
    handleStatusChange,
    handleDelete,
    filter,
    setFilter,
    getCurrentWeek,
    getCurrentYear
  } = useScheduledAudits();

  const toggleForm = () => {
    setShowForm(!showForm);
    setErrorMessage(null);
  };

  const handleFormSubmit = (data: ScheduledAuditInput) => {
    setErrorMessage(null);
    
    // Add additional logging for debugging
    console.log('Enviando dados para criação de auditoria programada:', data);
    
    createScheduledAudit.mutate(data, {
      onSuccess: () => {
        setShowForm(false);
        console.log('Auditoria programada com sucesso');
      },
      onError: (error) => {
        console.error("Erro ao criar auditoria programada:", error);
        setErrorMessage(error.message || "Erro ao programar auditoria. Tente novamente mais tarde.");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Auditorias Programadas</h2>
        <Button onClick={toggleForm}>
          {showForm ? (
            <><X className="mr-2 h-4 w-4" /> Cancelar</>
          ) : (
            <><PlusCircle className="mr-2 h-4 w-4" /> Nova Auditoria Programada</>
          )}
        </Button>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Auditoria Programada</CardTitle>
          </CardHeader>
          <CardContent>
            <NewScheduledAuditForm 
              departments={departments}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
              isSubmitting={createScheduledAudit.isPending}
              currentWeek={getCurrentWeek()}
              currentYear={getCurrentYear()}
            />
          </CardContent>
        </Card>
      )}

      <ScheduledAuditFilters 
        departments={departments} 
        onFilterChange={setFilter}
        currentFilter={filter}
      />

      <ScheduledAuditList 
        scheduledAudits={scheduledAudits}
        isLoading={isLoading}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
