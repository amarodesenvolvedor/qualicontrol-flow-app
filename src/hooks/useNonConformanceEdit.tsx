
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nonConformanceFormSchema, NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import { useNonConformanceData } from "./useNonConformanceData";
import { useNonConformanceSubmit } from "./useNonConformanceSubmit";
import { useNonConformancePdfExport } from "./useNonConformancePdfExport";

export const useNonConformanceEdit = () => {
  const { ncData, isLoading, error, id } = useNonConformanceData();
  const { handleSubmit, handleCancel, isSubmitting } = useNonConformanceSubmit(id);
  const { generateAcac } = useNonConformancePdfExport();
  
  const form = useForm<NonConformanceFormValues>({
    resolver: zodResolver(nonConformanceFormSchema),
    defaultValues: {
      code: "",
      title: "",
      description: "",
      location: "",
      department_id: "",
      immediate_actions: "",
      responsible_name: "",
      auditor_name: "",
      status: 'pending' as const,
    }
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
        immediate_actions: ncData.immediate_actions || "",
        responsible_name: ncData.responsible_name,
        auditor_name: ncData.auditor_name,
        occurrence_date: ncData.occurrence_date ? new Date(ncData.occurrence_date) : new Date(),
        response_date: ncData.response_date ? new Date(ncData.response_date) : undefined,
        action_verification_date: ncData.action_verification_date ? new Date(ncData.action_verification_date) : undefined,
        effectiveness_verification_date: ncData.effectiveness_verification_date ? new Date(ncData.effectiveness_verification_date) : undefined,
        completion_date: ncData.completion_date ? new Date(ncData.completion_date) : undefined,
        status: ncData.status,
      });
    }
  }, [ncData, form]);

  const onSubmit = form.handleSubmit((values) => {
    handleSubmit(values);
  });

  const handleGenerateAcac = () => {
    const formValues = form.getValues();
    generateAcac(formValues, ncData, id || '');
  };

  return {
    form,
    ncData,
    isLoading,
    error,
    onSubmit,
    handleCancel,
    isSubmitting,
    id,
    generateAcac: handleGenerateAcac
  };
};
