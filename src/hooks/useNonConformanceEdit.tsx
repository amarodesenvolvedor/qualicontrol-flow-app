
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nonConformanceFormSchema, NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import { useNonConformanceData } from "./useNonConformanceData";
import { useNonConformanceSubmit } from "./useNonConformanceSubmit";
import { useNonConformancePdfExport } from "./useNonConformancePdfExport";
import { useQueryClient } from "@tanstack/react-query";

export const useNonConformanceEdit = () => {
  const { ncData, isLoading, error, id } = useNonConformanceData();
  const { handleSubmit, handleCancel, isSubmitting } = useNonConformanceSubmit(id);
  const { generateAcac } = useNonConformancePdfExport();
  const queryClient = useQueryClient();
  
  const form = useForm<NonConformanceFormValues>({
    resolver: zodResolver(nonConformanceFormSchema),
    defaultValues: {
      code: "",
      title: "",
      description: "",
      location: "",
      department_id: "",
      iso_requirement: "",
      immediate_actions: "",
      responsible_name: "",
      auditor_name: "",
      status: 'pending' as const,
    }
  });

  // Force invalidate the query when the component mounts to ensure we have fresh data
  useEffect(() => {
    if (id) {
      console.log('Invalidating queries for fresh data on mount');
      queryClient.invalidateQueries({ queryKey: ['nonConformanceEdit', id] });
    }
  }, [id, queryClient]);

  useEffect(() => {
    if (ncData) {
      console.log('Setting form values from ncData:', ncData);
      
      // Helper function to safely convert string dates to Date objects
      const parseDateSafely = (dateStr: string | null): Date | undefined => {
        if (!dateStr) return undefined;
        try {
          const date = new Date(dateStr);
          return !isNaN(date.getTime()) ? date : undefined;
        } catch (e) {
          console.error('Error parsing date:', e, dateStr);
          return undefined;
        }
      };
      
      form.reset({
        code: ncData.code || "",
        title: ncData.title,
        description: ncData.description || "",
        location: ncData.location || "",
        department_id: ncData.department_id,
        iso_requirement: ncData.iso_requirement || "",
        immediate_actions: ncData.immediate_actions || "",
        responsible_name: ncData.responsible_name,
        auditor_name: ncData.auditor_name,
        occurrence_date: parseDateSafely(ncData.occurrence_date) || new Date(),
        response_date: parseDateSafely(ncData.response_date),
        action_verification_date: parseDateSafely(ncData.action_verification_date),
        effectiveness_verification_date: parseDateSafely(ncData.effectiveness_verification_date),
        completion_date: parseDateSafely(ncData.completion_date),
        status: ncData.status,
      });
      
      // Log the actual form values after reset for debugging
      setTimeout(() => {
        const currentValues = form.getValues();
        console.log('Current form values after reset:', currentValues);
      }, 0);
    }
  }, [ncData, form]);

  const onSubmit = form.handleSubmit((values) => {
    console.log('Form submitted with values:', values);
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
