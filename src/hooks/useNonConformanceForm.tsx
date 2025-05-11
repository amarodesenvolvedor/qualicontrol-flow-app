import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { useNonConformances } from "@/hooks/useNonConformances";
import { validateNonConformanceForm } from "@/utils/formValidation";
import { sendNonConformanceNotification } from "@/services/notificationService";

export const useNonConformanceForm = () => {
  const navigate = useNavigate();
  const { createNonConformance, error: apiError, uploadFiles } = useNonConformances();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    department_id: "",
    category: "",
    immediate_actions: "",
    responsible_name: "",
    auditor_name: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const handleDepartmentChange = (value: string) => {
    setFormData({...formData, department_id: value});
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData({...formData, category: value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Use the validation utility
    if (!validateNonConformanceForm(formData, selectedDate, deadlineDate)) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Create the non-conformance record
      const nonConformanceData = {
        ...formData,
        immediate_actions: "", // Will be filled later by the responsible person
        occurrence_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        deadline_date: deadlineDate ? format(deadlineDate, 'yyyy-MM-dd') : null,
        status: 'pending' as const
      };
      
      const result = await createNonConformance.mutateAsync(nonConformanceData);
      
      // Upload files if any
      if (files.length > 0 && result) {
        await uploadFiles(files);
      }
      
      // Send notification to the department responsible using the notification service
      if (result) {
        await sendNonConformanceNotification(result.id, formData.department_id, formData.responsible_name);
      }
      
      // Show success message and redirect
      toast({
        title: "Não Conformidade Registrada",
        description: `Sua não conformidade foi registrada com sucesso! ID: ${result?.code}`
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
    formData,
    selectedDate,
    deadlineDate,
    files,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    removeFile,
    handleDepartmentChange,
    handleCategoryChange,
    setSelectedDate,
    setDeadlineDate,
    handleSubmit,
    handleCancel
  };
};
