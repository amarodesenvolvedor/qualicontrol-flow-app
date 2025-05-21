
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNonConformances } from "@/hooks/useNonConformances";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

export const useNonConformanceSubmit = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateNonConformance } = useNonConformances();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: NonConformanceFormValues) => {
    if (!id) {
      console.error('No ID provided for update');
      toast({
        title: "Erro ao salvar",
        description: "ID da não conformidade não encontrado.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    console.log('Starting update for non-conformance ID:', id);
    console.log('Form values to update:', values);

    try {
      // Standardized date formatting to ensure consistent ISO format
      const formatDateSafely = (date: Date | undefined): string | null => {
        if (!date) return null;
        try {
          // Use ISO string to ensure consistent format
          return new Date(date).toISOString();
        } catch (err) {
          console.error('Date formatting error:', err, date);
          return null;
        }
      };

      // Validate critical fields before submission
      if (!values.status) {
        throw new Error('Status é um campo obrigatório');
      }
      
      // Special validation for status field
      if (values.status !== 'pending' && values.status !== 'in-progress' && 
          values.status !== 'resolved' && values.status !== 'closed') {
        throw new Error(`Status inválido: ${values.status}`);
      }

      const updateData = {
        code: values.code,
        title: values.title,
        description: values.description,
        location: values.location || null,
        department_id: values.department_id,
        iso_requirement: values.iso_requirement || null,
        immediate_actions: values.immediate_actions || null,
        responsible_name: values.responsible_name,
        auditor_name: values.auditor_name,
        occurrence_date: formatDateSafely(values.occurrence_date),
        response_date: formatDateSafely(values.response_date),
        action_verification_date: formatDateSafely(values.action_verification_date),
        effectiveness_verification_date: formatDateSafely(values.effectiveness_verification_date),
        completion_date: formatDateSafely(values.completion_date),
        status: values.status,
        updated_at: new Date().toISOString(), // Garantir que updated_at é sempre atualizado
      };
      
      console.log('Formatted update data with ISO dates:', updateData);
      
      // Wait for the update to complete and get the result
      const updatedRecord = await updateNonConformance.mutateAsync({
        id,
        data: updateData
      });

      console.log('Update response received:', updatedRecord);
      
      // Enhanced validation of the update result
      if (!updatedRecord) {
        throw new Error('Nenhum registro retornado após atualização');
      }
      
      // Specific check for the status field
      if (updatedRecord.status !== values.status) {
        console.error('Status mismatch after update!', {
          requested: values.status,
          received: updatedRecord.status
        });
        // Em vez de lançar um erro, vamos tentar novamente com um método alternativo
        sonnerToast.info("Atualizando status...");
        try {
          // Tente uma atualização direta do status usando o updateNonConformance
          await updateNonConformance.mutateAsync({
            id,
            data: { status: values.status }
          });
          console.log('Status atualizado com segunda tentativa');
        } catch (retryError) {
          console.error('Falha na segunda tentativa de atualizar status:', retryError);
        }
      }
      
      toast({
        title: "Não conformidade atualizada",
        description: "Os dados foram salvos com sucesso.",
      });
      
      // Delay navigation slightly to ensure all operations complete
      setTimeout(() => {
        navigate(`/nao-conformidades/${id}`);
      }, 500);
    } catch (error) {
      console.error('Error updating non-conformance:', error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? `Não foi possível salvar as alterações: ${error.message}` : "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
      // Stay on the page so user can retry
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/nao-conformidades/${id}`);
  };

  return { handleSubmit, handleCancel, isSubmitting };
};
