
import { toast } from "sonner";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NonConformance } from "@/types/nonConformance";

interface NotificationWrapperProps {
  children: React.ReactNode;
}

export const NotificationWrapper = ({ children }: NotificationWrapperProps) => {
  useEffect(() => {
    // Subscribe to realtime notifications for non-conformances
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'non_conformances' },
        (payload) => {
          const newNonConformance = payload.new as NonConformance;
          toast.info(`Nova não conformidade registrada: ${newNonConformance.code}`, {
            description: `${newNonConformance.title}`,
            duration: 5000,
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'non_conformances' },
        (payload) => {
          const updatedNonConformance = payload.new as NonConformance;
          const oldData = payload.old as Partial<NonConformance>;
          
          // Check if status changed
          if (updatedNonConformance.status !== oldData.status) {
            toast.info(`Status atualizado: ${updatedNonConformance.code}`, {
              description: `Status alterado de ${oldData.status || 'desconhecido'} para ${updatedNonConformance.status}`,
              duration: 5000,
            });
          }
          
          // Check if deadline is approaching (within 3 days)
          if (updatedNonConformance.deadline_date) {
            const deadline = new Date(updatedNonConformance.deadline_date);
            const today = new Date();
            const diffTime = Math.abs(deadline.getTime() - today.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 3 && updatedNonConformance.status !== 'closed' && updatedNonConformance.status !== 'resolved') {
              toast.warning(`Prazo crítico: ${updatedNonConformance.code}`, {
                description: `Prazo se encerra em ${diffDays} dias`,
                duration: 8000,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return <>{children}</>;
};

export default NotificationWrapper;
