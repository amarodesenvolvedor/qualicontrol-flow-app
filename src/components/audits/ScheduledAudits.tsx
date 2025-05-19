
import { useState } from 'react';
import { useScheduledAudits } from '@/hooks/useScheduledAudits';
import { useDepartments } from '@/hooks/useDepartments';
import { ScheduledAuditList } from './ScheduledAuditList';
import { NewScheduledAuditForm } from './NewScheduledAuditForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, X } from 'lucide-react';
import { ScheduledAuditFilters } from './ScheduledAuditFilters';
import { ScheduledAuditInput } from '@/types/audit';

export const ScheduledAudits = () => {
  const [showForm, setShowForm] = useState(false);
  const { departments } = useDepartments();
  
  const {
    scheduledAudits,
    isLoading,
    createScheduledAudit,
    updateScheduledAudit,
    deleteScheduledAudit,
    filter,
    setFilter,
    getCurrentWeek,
    getCurrentYear
  } = useScheduledAudits();

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleFormSubmit = (data: ScheduledAuditInput) => {
    createScheduledAudit.mutate(data);
    setShowForm(false);
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
        onDelete={(id) => deleteScheduledAudit.mutate(id)}
        onStatusChange={(id, status) => {
          const typedStatus = status as "scheduled" | "in_progress" | "completed" | "cancelled";
          updateScheduledAudit.mutate({ id, data: { status: typedStatus } });
        }}
      />
    </div>
  );
};
