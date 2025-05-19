
import { useScheduledAuditsMutations } from './scheduledAudits/useScheduledAuditsMutations';
import { useScheduledAuditsQueries } from './scheduledAudits/useScheduledAuditsQueries';
import { getCurrentWeek, getCurrentYear, getWeekDates } from './scheduledAudits/utils';

export const useScheduledAudits = () => {
  // Get all query-related functionality
  const { 
    scheduledAudits, 
    isLoading, 
    isError,
    filter,
    setFilter,
    refetch
  } = useScheduledAuditsQueries();

  // Get all mutation-related functionality
  const {
    createScheduledAudit,
    updateScheduledAudit,
    deleteScheduledAudit
  } = useScheduledAuditsMutations();

  // Re-export everything for backwards compatibility
  return {
    scheduledAudits,
    isLoading,
    isError,
    createScheduledAudit,
    updateScheduledAudit,
    deleteScheduledAudit,
    filter,
    setFilter,
    getCurrentWeek,
    getCurrentYear,
    getWeekDates,
    refetch
  };
};
