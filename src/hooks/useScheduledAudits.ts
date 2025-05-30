
import { useState, useCallback } from 'react';
import { useScheduledAuditsMutations } from './scheduledAudits/useScheduledAuditsMutations';
import { useScheduledAuditsQueries } from './scheduledAudits/useScheduledAuditsQueries';
import { getWeekDates, getCurrentWeek, getCurrentYear } from './scheduledAudits/utils';

export const useScheduledAudits = () => {
  const [selectedAudit, setSelectedAudit] = useState(null);
  const { createScheduledAudit, updateScheduledAudit, deleteScheduledAudit } = useScheduledAuditsMutations();
  const { 
    scheduledAudits, 
    isLoading, 
    isError, 
    filter,
    setFilter,
    refetch
  } = useScheduledAuditsQueries();

  const handleStatusChange = useCallback(async (id: string, status: string) => {
    // Converta o status para o tipo correto
    const typedStatus = status as "programada" | "agendada" | "concluida" | "atrasada";
    await updateScheduledAudit.mutate({ id, data: { status: typedStatus } });
    refetch();
  }, [updateScheduledAudit, refetch]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteScheduledAudit.mutate(id);
    refetch();
  }, [deleteScheduledAudit, refetch]);

  return {
    scheduledAudits,
    isLoading,
    isError,
    selectedAudit,
    setSelectedAudit,
    createScheduledAudit,
    updateScheduledAudit,
    deleteScheduledAudit,
    handleStatusChange,
    handleDelete,
    filter,
    setFilter,
    refetch,
    getWeekDates,
    getCurrentWeek,
    getCurrentYear
  };
};
