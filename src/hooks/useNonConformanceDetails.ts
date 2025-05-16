
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NonConformance } from "@/types/nonConformance";
import { toast } from "sonner";
import { exportNonConformanceToPDF } from "@/services/exports/pdf";
import { exportNonConformanceToExcel } from "@/services/exports/excelExportService";

export const useNonConformanceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [nonConformance, setNonConformance] = useState<NonConformance | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  // Force refetch on component mount to ensure we have the latest data
  useEffect(() => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: ['nonConformance', id] });
    }
  }, [id, queryClient]);

  // Fetch non-conformance data from Supabase
  const { data: ncData, isLoading, error } = useQuery({
    queryKey: ['nonConformance', id],
    queryFn: async () => {
      if (!id) return null;
      
      console.log('Fetching details for non-conformance ID:', id);
      
      const { data, error } = await supabase
        .from('non_conformances')
        .select(`
          *,
          department:department_id (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      console.log('Fetched non-conformance details:', data);
      return data as NonConformance;
    },
    staleTime: 0, // Always consider the data stale to force refetch
    refetchOnMount: 'always' // Always refetch when component mounts
  });

  // Update state when data is loaded
  useEffect(() => {
    if (ncData) {
      console.log('Setting non-conformance state from query data:', ncData);
      setNonConformance(ncData);
    }
  }, [ncData]);

  // Export functions
  const exportToPDF = async () => {
    if (!nonConformance) return;
    
    toast.success("Iniciando download do PDF...", {
      description: `${nonConformance.code} - ${nonConformance.title}`
    });
    
    try {
      await exportNonConformanceToPDF(nonConformance);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Erro ao gerar o PDF", {
        description: "Não foi possível gerar o arquivo PDF."
      });
    }
  };

  const exportToExcel = async () => {
    if (!nonConformance) return;
    
    toast.success("Iniciando download da planilha Excel...", {
      description: `${nonConformance.code} - ${nonConformance.title}`
    });
    
    try {
      await exportNonConformanceToExcel(nonConformance);
      toast.success("Planilha Excel gerada com sucesso!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Erro ao gerar a planilha", {
        description: "Não foi possível gerar o arquivo Excel."
      });
    }
  };

  return {
    id,
    nonConformance,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    exportToPDF,
    exportToExcel
  };
};
