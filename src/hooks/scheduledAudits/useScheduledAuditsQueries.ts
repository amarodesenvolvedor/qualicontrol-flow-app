
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScheduledAudit } from '@/types/audit';
import { getScheduledAuditsTable, isAuditOverdue } from './utils';

export type ScheduledAuditFilter = { 
  year?: number;
  status?: string;
  departmentId?: string;
};

export const useScheduledAuditsQueries = () => {
  const [filter, setFilter] = useState<ScheduledAuditFilter>({});

  // Query to fetch all scheduled audits
  const fetchScheduledAudits = async (): Promise<ScheduledAudit[]> => {
    try {
      console.log('Buscando auditorias programadas com filtros:', filter);
      
      let query = getScheduledAuditsTable()
        .select(`
          *,
          department:department_id (
            id,
            name
          )
        `);

      if (filter.year) {
        query = query.eq('year', filter.year);
      }

      if (filter.departmentId) {
        query = query.eq('department_id', filter.departmentId);
      }

      if (filter.status) {
        query = query.eq('status', filter.status);
      }

      query = query.order('week_number', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar auditorias programadas:', error);
        throw new Error(error.message);
      }
      
      console.log('Auditorias programadas recuperadas:', data?.length || 0);
      
      // Process audits to identify overdue ones (that have status "programada" but week has passed)
      const processedAudits = data?.map(audit => {
        const typedAudit = audit as unknown as ScheduledAudit;
        
        // If the audit is "programada" and the week has already passed, mark it as "atrasada"
        if (isAuditOverdue(typedAudit)) {
          return {...typedAudit, status: 'atrasada'};
        }
        
        return typedAudit;
      }) || [];
      
      return processedAudits;
    } catch (error: any) {
      console.error('Exceção ao buscar auditorias programadas:', error);
      throw new Error(`Erro ao buscar auditorias: ${error.message}`);
    }
  };

  const scheduledAuditsQuery = useQuery({
    queryKey: ['scheduledAudits', filter],
    queryFn: fetchScheduledAudits,
  });

  return {
    scheduledAudits: scheduledAuditsQuery.data || [],
    isLoading: scheduledAuditsQuery.isLoading,
    isError: scheduledAuditsQuery.isError,
    filter,
    setFilter,
    refetch: scheduledAuditsQuery.refetch
  };
};
