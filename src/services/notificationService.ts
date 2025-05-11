
import { toast } from "@/components/ui/use-toast";

/**
 * Sends a notification email to the responsible person about a new non-conformance
 * 
 * @param nonConformanceId The ID of the non-conformance
 * @param departmentId The department ID
 * @param responsibleName The name of the responsible person
 * @returns A promise that resolves to a boolean indicating success or failure
 */
export const sendNonConformanceNotification = async (
  nonConformanceId: string, 
  departmentId: string, 
  responsibleName: string
): Promise<boolean> => {
  try {
    // In a real implementation, this would call an API endpoint or edge function
    console.log(`Sending notification email for NC ${nonConformanceId} to responsible: ${responsibleName} of department: ${departmentId}`);
    
    // Simulate successful email sending
    toast({
      title: "Notificação enviada",
      description: `Uma notificação foi enviada para ${responsibleName} para preencher as ações imediatas.`
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    return false;
  }
};
