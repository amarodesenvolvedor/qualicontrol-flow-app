
import { format } from "date-fns";
import { NonConformance } from "@/types/nonConformance";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import { exportAcacToPDF } from "@/services/exports/pdf";
import { useToast } from "@/hooks/use-toast";

export const useNonConformancePdfExport = () => {
  const { toast } = useToast();

  const generateAcac = async (formValues: NonConformanceFormValues, ncData: NonConformance | null, id: string) => {
    try {
      // Format the data for ACAC PDF generation
      const acacData: NonConformance = {
        id: id || '',
        code: formValues.code || null,
        title: formValues.title,
        description: formValues.description || null,
        location: formValues.location || null,
        department_id: formValues.department_id,
        immediate_actions: formValues.immediate_actions || null,
        responsible_name: formValues.responsible_name,
        auditor_name: formValues.auditor_name,
        occurrence_date: formValues.occurrence_date ? format(formValues.occurrence_date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        response_date: formValues.response_date ? format(formValues.response_date, 'yyyy-MM-dd') : null,
        action_verification_date: formValues.action_verification_date 
          ? format(formValues.action_verification_date, 'yyyy-MM-dd') 
          : null,
        effectiveness_verification_date: formValues.effectiveness_verification_date 
          ? format(formValues.effectiveness_verification_date, 'yyyy-MM-dd') 
          : null,
        completion_date: formValues.completion_date 
          ? format(formValues.completion_date, 'yyyy-MM-dd') 
          : null,
        created_at: ncData?.created_at || format(new Date(), 'yyyy-MM-dd'),
        status: formValues.status,
        department: ncData?.department,
        root_cause_analysis: formValues.root_cause_analysis || null,
        corrective_action: formValues.corrective_action || null
      };
      
      // Generate ACAC PDF
      await exportAcacToPDF(acacData);
      
      // Show success notification
      toast({
        title: "ACAC gerado com sucesso",
        description: "O documento ACAC foi baixado para o seu dispositivo.",
      });
    } catch (error) {
      console.error("Erro ao gerar ACAC:", error);
      toast({
        title: "Erro ao gerar ACAC",
        description: "Não foi possível gerar o documento ACAC. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return { generateAcac };
};
