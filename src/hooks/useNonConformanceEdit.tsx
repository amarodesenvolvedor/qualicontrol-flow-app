
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";
import { useNonConformances, NonConformance } from "@/hooks/useNonConformances";
import { format } from "date-fns";
import { nonConformanceFormSchema, NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";

export const useNonConformanceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateNonConformance } = useNonConformances();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<NonConformanceFormValues>({
    resolver: zodResolver(nonConformanceFormSchema),
    defaultValues: {
      code: "",
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
      if (!id) {
        console.error('No ID provided for query');
        return null;
      }
      
      console.log('Fetching non-conformance with ID:', id);
      try {
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
          .maybeSingle();

        if (error) {
          console.error('Error fetching non-conformance:', error);
          throw error;
        }
        
        if (!data) {
          console.error('No non-conformance found with ID:', id);
          return null;
        }
        
        console.log('Fetched non-conformance data:', data);
        return data as NonConformance;
      } catch (err) {
        console.error('Exception in fetch query:', err);
        throw err;
      }
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (ncData) {
      console.log('Setting form values from ncData:', ncData);
      form.reset({
        code: ncData.code || "",
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
        location: values.location,
        department_id: values.department_id,
        category: values.category,
        immediate_actions: values.immediate_actions || null,
        responsible_name: values.responsible_name,
        auditor_name: values.auditor_name,
        occurrence_date: format(values.occurrence_date, 'yyyy-MM-dd'),
        deadline_date: values.deadline_date ? format(values.deadline_date, 'yyyy-MM-dd') : null,
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

  return {
    form,
    ncData,
    isLoading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    handleCancel,
    isSubmitting,
    id
  };
};
