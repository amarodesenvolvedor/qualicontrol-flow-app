
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Request notification permission from the browser
 * @returns A Promise that resolves to the permission state: 'granted', 'denied', or 'default'
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

/**
 * Send a browser notification
 * @param title The title of the notification
 * @param options Notification options
 */
export const sendBrowserNotification = (
  title: string,
  options?: NotificationOptions
) => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, options);
    
    notification.onclick = () => {
      if (options?.data?.url) {
        window.open(options.data.url, '_blank');
      }
      notification.close();
    };

    return notification;
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        sendBrowserNotification(title, options);
      }
    });
  }
};

/**
 * Send an email notification about a non-conformance
 * @param nonConformanceId ID of the non-conformance
 * @param departmentId ID of the department
 * @param responsibleName Name of the responsible person
 */
export const sendNonConformanceNotification = async (
  nonConformanceId: string,
  departmentId: string,
  responsibleName: string
) => {
  try {
    // In a real application, this would send an actual email
    console.log(`Sending notification for NC ${nonConformanceId} to department ${departmentId}, responsible: ${responsibleName}`);
    
    // For demonstration purposes, we're just returning a mock response
    return {
      success: true,
      message: `Notification sent to ${responsibleName}`
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      success: false,
      error: 'Failed to send notification'
    };
  }
};

/**
 * Show a toast notification for a non-conformance deadline
 * @param nonConformanceId ID of the non-conformance
 * @param code The non-conformance code
 * @param daysRemaining Days remaining until the deadline
 */
export const showDeadlineNotification = (
  nonConformanceId: string,
  code: string,
  daysRemaining: number
) => {
  toast({
    title: `Prazo se aproximando: ${code}`,
    description: `${daysRemaining} dias restantes para resolver esta não conformidade`,
    variant: "default"
  });

  // Also send a browser notification if permissions are granted
  if (Notification.permission === 'granted') {
    sendBrowserNotification(
      `Prazo se aproximando: ${code}`,
      {
        body: `${daysRemaining} dias restantes para resolver esta não conformidade`,
        icon: '/favicon.ico',
        data: {
          url: `/nao-conformidades/${nonConformanceId}`
        }
      }
    );
  }
};
