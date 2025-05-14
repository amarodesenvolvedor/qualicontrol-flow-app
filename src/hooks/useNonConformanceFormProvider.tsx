
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useNonConformances } from "@/hooks/useNonConformances";
import { nonConformanceFormSchema, NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import { format } from "date-fns";
import { sendNonConformanceNotification } from "@/services/notificationService";

export const useNonConformanceFormProvider = () => {
  const navigate = useNavigate();
  const { createNonConformance, error: apiError, uploadFiles } = useNonConformances();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Create a form instance with our schema
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
      occurrence_date: new Date(),
      response_date: undefined,
      action_verification_date: undefined,
      effectiveness_verification_date: undefined,
      completion_date: undefined,
      status: "pending",
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: NonConformanceFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create the non-conformance record with proper typing
      const nonConformanceData = {
        code: data.code || null,
        title: data.title,
        description: data.description,
        location: data.location || null,
        department_id: data.department_id,
        immediate_actions: data.immediate_actions || null,
        responsible_name: data.responsible_name,
        auditor_name: data.auditor_name,
        occurrence_date: format(data.occurrence_date, 'yyyy-MM-dd'),
        response_date: data.response_date ? format(data.response_date, 'yyyy-MM-dd') : null,
        action_verification_date: data.action_verification_date 
          ? format(data.action_verification_date, 'yyyy-MM-dd') 
          : null,
        effectiveness_verification_date: data.effectiveness_verification_date 
          ? format(data.effectiveness_verification_date, 'yyyy-MM-dd') 
          : null,
        completion_date: data.completion_date 
          ? format(data.completion_date, 'yyyy-MM-dd') 
          : null,
        status: data.status,
      };
      
      const result = await createNonConformance.mutateAsync(nonConformanceData);
      
      // Upload files if any
      if (files.length > 0 && result) {
        await uploadFiles(files);
      }
      
      // Send notification to the department responsible
      if (result) {
        await sendNonConformanceNotification(result.id, data.department_id, data.responsible_name);
      }
      
      // Show success message and redirect
      toast({
        title: "Não Conformidade Registrada",
        description: `Sua não conformidade foi registrada com sucesso!${result?.code ? ` ID: ${result.code}` : ''}`
      });
      
      navigate("/nao-conformidades");
    } catch (error) {
      console.error("Erro ao salvar não conformidade:", error);
      toast({
        title: "Erro ao registrar",
        description: apiError ? apiError.message : "Ocorreu um erro ao registrar a não conformidade.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/nao-conformidades");
  };

  return {
    form,
    files,
    isSubmitting,
    handleFileChange,
    removeFile,
    onSubmit: form.handleSubmit(onSubmit),
    handleCancel
  };
};
