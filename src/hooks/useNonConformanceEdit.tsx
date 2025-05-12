
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNonConformances, NonConformance } from "@/hooks/useNonConformances";
import { format } from "date-fns";
import { nonConformanceFormSchema, NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";

export const useNonConformanceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateNonConformance } = useNonConformances();
  
  const form = useForm<NonConformanceFormValues>({
    resolver: zodResolver(nonConformanceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      department_id: "",
      category: "",
      immediate_actions: "",
      responsible_name: "",
      auditor_name: "",
      status: 'pending' as const,
    }
  });

  const { data: ncData, isLoading, error } = useQuery({
    queryKey: ['nonConformanceEdit', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('non_conformances')
        .select(`
          *,
          department:department_id (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as NonConformance;
    },
  });

  useEffect(() => {
    if (ncData) {
      form.reset({
        title: ncData.title,
        description: ncData.description || "",
        location: ncData.location || "",
        department_id: ncData.department_id,
        category: ncData.category,
        immediate_actions: ncData.immediate_actions || "",
        responsible_name: ncData.responsible_name,
        auditor_name: ncData.auditor_name,
        occurrence_date: ncData.occurrence_date ? new Date(ncData.occurrence_date) : new Date(),
        deadline_date: ncData.deadline_date ? new Date(ncData.deadline_date) : undefined,
        effectiveness_verification_date: ncData.effectiveness_verification_date ? new Date(ncData.effectiveness_verification_date) : undefined,
        completion_date: ncData.completion_date ? new Date(ncData.completion_date) : undefined,
        status: ncData.status,
      });
    }
  }, [ncData, form]);

  const onSubmit = async (values: NonConformanceFormValues) => {
    if (!id) return;

    try {
      await updateNonConformance.mutateAsync({
        id,
        data: {
          ...values,
          occurrence_date: format(values.occurrence_date, 'yyyy-MM-dd'),
          deadline_date: values.deadline_date ? format(values.deadline_date, 'yyyy-MM-dd') : null,
          effectiveness_verification_date: values.effectiveness_verification_date 
            ? format(values.effectiveness_verification_date, 'yyyy-MM-dd') 
            : null,
          completion_date: values.completion_date 
            ? format(values.completion_date, 'yyyy-MM-dd') 
            : null,
        }
      });

      toast({
        title: "Não conformidade atualizada",
        description: "Os dados foram salvos com sucesso.",
      });
      
      navigate(`/nao-conformidades/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar não conformidade:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate(`/nao-conformidades/${id}`);
  };

  return {
    form,
    ncData,
    isLoading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    handleCancel,
    id
  };
};
