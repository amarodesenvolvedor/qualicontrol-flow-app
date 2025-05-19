
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ScheduledAudit, ScheduledAuditInput } from '@/types/audit';

// Using this type to handle the generic database client
type SupabaseAny = any;

export const useScheduledAudits = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<{ 
    year?: number;
    status?: string;
    departmentId?: string;
  }>({});

  // Function to get current ISO week number
  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    const week = Math.ceil((day + start.getDay()) / 7);
    return week;
  };

  // Function to get current year
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  // Query to fetch all scheduled audits
  const fetchScheduledAudits = async (): Promise<ScheduledAudit[]> => {
    try {
      console.log('Buscando auditorias programadas com filtros:', filter);
      
      // Use a complete type assertion to bypass TypeScript error
      const client = supabase as SupabaseAny;
      let query = client
        .from('scheduled_audits')
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
      // Cast the data to the correct type
      return data as ScheduledAudit[];
    } catch (error: any) {
      console.error('Exceção ao buscar auditorias programadas:', error);
      throw new Error(`Erro ao buscar auditorias: ${error.message}`);
    }
  };

  const scheduledAuditsQuery = useQuery({
    queryKey: ['scheduledAudits', filter],
    queryFn: fetchScheduledAudits,
  });

  // Mutation to create a new scheduled audit
  const createScheduledAudit = useMutation({
    mutationFn: async (input: ScheduledAuditInput) => {
      try {
        console.log('Criando auditoria programada com dados:', input);
        
        // Use a complete type assertion to bypass TypeScript error
        const client = supabase as SupabaseAny;
        const { data, error } = await client
          .from('scheduled_audits')
          .insert(input)
          .select();
          
        if (error) {
          console.error('Erro ao criar auditoria programada:', error);
          throw new Error(`Erro no banco de dados: ${error.message}`);
        }
        
        console.log('Auditoria programada criada com sucesso:', data);
        return data;
      } catch (error: any) {
        console.error('Exceção ao criar auditoria programada:', error);
        throw new Error(`Falha ao programar auditoria: ${error.message}`);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Auditoria programada',
        description: 'A auditoria foi programada com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['scheduledAudits'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: `Erro ao programar auditoria: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Mutation to update a scheduled audit
  const updateScheduledAudit = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<ScheduledAuditInput> }) => {
      try {
        // Use a complete type assertion to bypass TypeScript error
        const client = supabase as SupabaseAny;
        const { error } = await client
          .from('scheduled_audits')
          .update(data)
          .eq('id', id);
          
        if (error) {
          console.error('Erro ao atualizar auditoria programada:', error);
          throw new Error(error.message);
        }
        return { success: true };
      } catch (error: any) {
        console.error('Exceção ao atualizar auditoria programada:', error);
        throw new Error(`Erro ao atualizar: ${error.message}`);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Auditoria atualizada',
        description: 'A auditoria programada foi atualizada com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['scheduledAudits'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: `Erro ao atualizar auditoria: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Mutation to delete a scheduled audit
  const deleteScheduledAudit = useMutation({
    mutationFn: async (id: string) => {
      try {
        // Use a complete type assertion to bypass TypeScript error
        const client = supabase as SupabaseAny;
        const { error } = await client
          .from('scheduled_audits')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Erro ao remover auditoria programada:', error);
          throw new Error(error.message);
        }
        return { success: true };
      } catch (error: any) {
        console.error('Exceção ao remover auditoria programada:', error);
        throw new Error(`Erro ao remover: ${error.message}`);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Auditoria removida',
        description: 'A auditoria programada foi removida com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['scheduledAudits'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: `Erro ao remover auditoria: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Helper function to calculate week dates
  const getWeekDates = (year: number, week: number) => {
    const target = new Date(year, 0, 1);
    const dayNum = target.getDay();
    const diff = week * 7;
    
    // Calculate first day of week
    if (dayNum <= 4) {
      target.setDate(target.getDate() - target.getDay() + 1 + diff);
    } else {
      target.setDate(target.getDate() + (7 - target.getDay()) + 1 + diff);
    }
    
    const startDate = new Date(target);
    const endDate = new Date(target);
    endDate.setDate(endDate.getDate() + 6);
    
    return { startDate, endDate };
  };

  return {
    scheduledAudits: scheduledAuditsQuery.data || [],
    isLoading: scheduledAuditsQuery.isLoading,
    isError: scheduledAuditsQuery.isError,
    createScheduledAudit,
    updateScheduledAudit,
    deleteScheduledAudit,
    filter,
    setFilter,
    getCurrentWeek,
    getCurrentYear,
    getWeekDates
  };
};
