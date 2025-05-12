
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    // First get the non-conformance details
    const { data: ncData } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', nonConformanceId)
      .single();
    
    if (!ncData) {
      throw new Error("Não conformidade não encontrada");
    }
    
    // Get department details to find associated emails
    const { data: deptData } = await supabase
      .from('departments')
      .select('name')
      .eq('id', departmentId)
      .single();
    
    const departmentName = deptData?.name || "Departamento não especificado";
    
    // In a real implementation, this would call an API endpoint or edge function
    console.log(`Sending notification email for NC ${nonConformanceId} to responsible: ${responsibleName} of department: ${departmentName}`);
    console.log(`Email content: Nova não conformidade registrada: ${ncData.code} - ${ncData.title}`);
    
    // Simulate sending push notification via browser API
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("Nova Não Conformidade", {
          body: `${ncData.code} - ${ncData.title} (Responsável: ${responsibleName})`,
          icon: "/favicon.ico"
        });
      } catch (error) {
        console.warn("Notificação do navegador falhou:", error);
      }
    }
    
    // Simulate successful email sending
    toast({
      title: "Notificação enviada",
      description: `Uma notificação foi enviada para ${responsibleName} sobre a não conformidade ${ncData.code}.`
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    return false;
  }
};

/**
 * Sends a reminder notification about approaching deadline
 * 
 * @param nonConformanceId The ID of the non-conformance
 * @param daysRemaining Number of days remaining until deadline
 * @returns A promise that resolves to a boolean indicating success or failure
 */
export const sendDeadlineNotification = async (
  nonConformanceId: string,
  daysRemaining: number
): Promise<boolean> => {
  try {
    // Get the non-conformance details
    const { data } = await supabase
      .from('non_conformances')
      .select('code, title, responsible_name')
      .eq('id', nonConformanceId)
      .single();
    
    if (!data) {
      throw new Error("Não conformidade não encontrada");
    }
    
    // In a real implementation, this would call an API endpoint or edge function
    console.log(`Sending deadline notification for NC ${nonConformanceId} - ${daysRemaining} days remaining`);
    
    // Simulate sending push notification
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("Prazo se aproximando", {
          body: `${data.code} - ${data.title} (${daysRemaining} dias restantes)`,
          icon: "/favicon.ico"
        });
      } catch (error) {
        console.warn("Notificação do navegador falhou:", error);
      }
    }
    
    toast({
      title: "Lembrete de prazo",
      description: `Apenas ${daysRemaining} dias restantes para a não conformidade ${data.code}.`,
      variant: "warning"
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação de prazo:", error);
    return false;
  }
};

/**
 * Request browser notification permission
 * @returns Promise that resolves with the permission state
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!("Notification" in window)) {
    console.log("Este navegador não suporta notificações desktop");
    return "denied";
  }
  
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
};
