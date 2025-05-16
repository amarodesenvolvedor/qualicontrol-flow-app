
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
      // Improved date formatting to include full ISO string with timezone
      const formatDateSafely = (date: Date | undefined): string | null => {
        if (!date) return null;
        try {
          // Use ISO string format which includes timezone information
          return date.toISOString();
        } catch (err) {
          console.error('Date formatting error:', err, date);
          return null;
        }
      };

      const updateData = {
        code: values.code,
        title: values.title,
        description: values.description,
        location: values.location || null,
        department_id: values.department_id,
        immediate_actions: values.immediate_actions || null,
        responsible_name: values.responsible_name,
        auditor_name: values.auditor_name,
        occurrence_date: formatDateSafely(values.occurrence_date),
        response_date: formatDateSafely(values.response_date),
        action_verification_date: formatDateSafely(values.action_verification_date),
        effectiveness_verification_date: formatDateSafely(values.effectiveness_verification_date),
        completion_date: formatDateSafely(values.completion_date),
        status: values.status,
      };
      
      console.log('Formatted update data with ISO dates:', updateData);
      
      const updatedRecord = await updateNonConformance.mutateAsync({
        id,
        data: updateData
      });

      console.log('Update response received:', updatedRecord);
      
      // Enhanced validation of the update result
      if (!updatedRecord) {
        console.error('No record returned after update!');
        toast({
          title: "Erro ao salvar",
          description: "A atualização foi processada, mas não foi possível confirmar as alterações.",
          variant: "destructive",
        });
        return;
      }
      
      // Double-check that the status was actually updated by comparing with the form value
      if (updatedRecord?.status !== values.status) {
        console.warn('Status mismatch after update!', {
          requested: values.status,
          received: updatedRecord?.status
        });
        sonnerToast.warning('Aviso', {
          description: 'Alguns campos podem não ter sido atualizados corretamente. Verifique os dados.'
        });
      } else {
        toast({
          title: "Não conformidade atualizada",
          description: "Os dados foram salvos com sucesso.",
        });
      }
      
      navigate(`/nao-conformidades/${id}`);
    } catch (error) {
      console.error('Error updating non-conformance:', error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? `Não foi possível salvar as alterações: ${error.message}` : "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/nao-conformidades/${id}`);
  };

  return { handleSubmit, handleCancel, isSubmitting };
};
