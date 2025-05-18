
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CompanySettings } from "@/types/settings";
import { supabase } from "@/integrations/supabase/client";

export const useCompanySettings = () => {
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyname: "",
    cnpj: "",
    address: "",
    city: "",
    state: "",
    cep: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Buscar as configurações da empresa
  const fetchCompanySettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar configurações:", error);
        toast({
          title: "Erro ao carregar configurações",
          description: "Não foi possível carregar as configurações da empresa.",
          variant: "destructive",
        });
      } else if (data) {
        setCompanySettings(data as CompanySettings);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar as configurações da empresa
  const saveCompanySettings = async (settings: CompanySettings) => {
    setIsSaving(true);
    try {
      // Verificar se já existe um registro
      const { data: existingData } = await supabase
        .from("company_settings")
        .select("id")
        .maybeSingle();

      let result;
      
      if (existingData?.id) {
        // Atualizar o registro existente
        result = await supabase
          .from("company_settings")
          .update({
            ...settings,
            updatedat: new Date().toISOString(), // Changed from updatedAt to updatedat
          })
          .eq("id", existingData.id);
      } else {
        // Inserir novo registro
        result = await supabase
          .from("company_settings")
          .insert({
            ...settings,
            createdat: new Date().toISOString(), // Changed from createdAt to createdat
            updatedat: new Date().toISOString(), // Changed from updatedAt to updatedat
          });
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Atualizar estado local
      setCompanySettings(settings);
      
      toast({
        title: "Configurações salvas",
        description: "As informações da empresa foram atualizadas com sucesso.",
      });
      
      return { success: true };
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações da empresa.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  return {
    companySettings,
    setCompanySettings,
    saveCompanySettings,
    isLoading,
    isSaving,
    refreshSettings: fetchCompanySettings,
  };
};
