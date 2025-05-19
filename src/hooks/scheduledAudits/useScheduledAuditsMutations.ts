
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { ScheduledAuditInput } from '@/types/audit';
import { getScheduledAuditsTable } from './utils';

export const useScheduledAuditsMutations = () => {
  const queryClient = useQueryClient();

  // Mutation to create a new scheduled audit
  const createScheduledAudit = useMutation({
    mutationFn: async (input: ScheduledAuditInput) => {
      try {
        console.log('Criando auditoria programada com dados:', input);
        
        const { data, error } = await getScheduledAuditsTable()
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
        const { error } = await getScheduledAuditsTable()
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
        const { error } = await getScheduledAuditsTable()
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

  return {
    createScheduledAudit,
    updateScheduledAudit,
    deleteScheduledAudit
  };
};
