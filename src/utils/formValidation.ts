
import { toast } from "@/components/ui/use-toast";

interface NonConformanceFormData {
  title: string;
  description: string;
  department_id: string;
  category: string;
  location: string;
  auditor_name: string;
  responsible_name: string;
}

export const validateNonConformanceForm = (
  formData: NonConformanceFormData,
  selectedDate?: Date,
  deadlineDate?: Date
): boolean => {
  if (
    !formData.title || 
    !formData.description || 
    !formData.department_id || 
    !formData.category || 
    !formData.location || 
    !formData.auditor_name || 
    !formData.responsible_name ||
    !selectedDate ||
    !deadlineDate
  ) {
    toast({
      title: "Campos obrigatórios",
      description: "Por favor, preencha todos os campos obrigatórios.",
      variant: "destructive"
    });
    return false;
  }
  
  return true;
};
