
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useNonConformances } from "@/hooks/useNonConformances";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import { useToast } from "@/hooks/use-toast";

export const useNonConformanceSubmit = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateNonConformance } = useNonConformances();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: NonConformanceFormValues) => {
    if (!id) {
      console.error('No ID provided for update');
      return;
    }
    
    setIsSubmitting(true);
    console.log('Starting update for non-conformance ID:', id);
    console.log('Form values to update:', values);

    try {
      const updateData = {
        code: values.code,
        title: values.title,
        description: values.description,
        location: values.location || null,
        department_id: values.department_id,
        immediate_actions: values.immediate_actions || null,
        responsible_name: values.responsible_name,
        auditor_name: values.auditor_name,
        occurrence_date: format(values.occurrence_date, 'yyyy-MM-dd'),
        response_date: values.response_date ? format(values.response_date, 'yyyy-MM-dd') : null,
        action_verification_date: values.action_verification_date 
          ? format(values.action_verification_date, 'yyyy-MM-dd') 
          : null,
        effectiveness_verification_date: values.effectiveness_verification_date 
          ? format(values.effectiveness_verification_date, 'yyyy-MM-dd') 
          : null,
        completion_date: values.completion_date 
          ? format(values.completion_date, 'yyyy-MM-dd') 
          : null,
        status: values.status,
      };
      
      console.log('Formatted update data:', updateData);
      
      await updateNonConformance.mutateAsync({
        id,
        data: updateData
      });

      toast({
        title: "Não conformidade atualizada",
        description: "Os dados foram salvos com sucesso.",
      });
      
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
