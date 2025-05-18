
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserPreferences } from "@/types/settings";
import { supabase } from "@/integrations/supabase/client";

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailnotifications: true, // Changed from emailNotifications
    systemnotifications: true, // Changed from systemNotifications
    darkmode: false, // Changed from darkMode
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Buscar as preferências do usuário
  const fetchUserPreferences = async () => {
    setIsLoading(true);
    try {
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session?.user) {
        return;
      }

      const userId = authData.session.user.id;
      
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("userid", userId) // Changed from userId to userid
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar preferências:", error);
      } else if (data) {
        setPreferences({
          emailnotifications: data.emailnotifications, // Changed from emailNotifications
          systemnotifications: data.systemnotifications, // Changed from systemNotifications
          darkmode: data.darkmode, // Changed from darkMode
        });
      }
    } catch (error) {
      console.error("Erro ao buscar preferências:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar as preferências do usuário
  const saveUserPreferences = async (newPreferences: UserPreferences) => {
    setIsSaving(true);
    try {
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session?.user) {
        throw new Error("Usuário não autenticado");
      }

      const userId = authData.session.user.id;
      
      // Verificar se já existe um registro para este usuário
      const { data: existingData } = await supabase
        .from("user_preferences")
        .select("id")
        .eq("userid", userId) // Changed from userId to userid
        .maybeSingle();

      let result;
      
      if (existingData?.id) {
        // Atualizar o registro existente
        result = await supabase
          .from("user_preferences")
          .update({
            ...newPreferences,
            updatedat: new Date().toISOString(), // Changed from updatedAt to updatedat
          })
          .eq("id", existingData.id);
      } else {
        // Inserir novo registro
        result = await supabase
          .from("user_preferences")
          .insert({
            ...newPreferences,
            userid: userId, // Changed from userId to userid
            createdat: new Date().toISOString(), // Changed from createdAt to createdat
            updatedat: new Date().toISOString(), // Changed from updatedAt to updatedat
          });
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Atualizar estado local
      setPreferences(newPreferences);
      
      toast({
        title: "Preferências salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      });
      
      return { success: true };
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas preferências.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  return {
    preferences,
    setPreferences,
    saveUserPreferences,
    isLoading,
    isSaving,
    refreshPreferences: fetchUserPreferences,
  };
};
