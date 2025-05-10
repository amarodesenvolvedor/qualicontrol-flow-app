
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export type NonConformance = {
  id: string;
  code: string;
  title: string;
  description: string;
  location: string;
  department_id: string;
  category: string;
  immediate_actions?: string | null;
  responsible_name: string;
  auditor_name: string;
  occurrence_date: string;
  deadline_date?: string | null;
  status: 'pending' | 'in-progress' | 'completed' | 'critical';
  created_at: string;
  updated_at: string;
  department?: { name: string; group_type: string } | null; // Adicionando um campo opcional para os dados do departamento
};

export type NonConformanceInput = Omit<
  NonConformance, 
  'id' | 'code' | 'created_at' | 'updated_at' | 'department'
>;

export const useNonConformances = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Buscar todas as não conformidades
  const getNonConformances = useQuery({
    queryKey: ["non_conformances"],
    queryFn: async (): Promise<NonConformance[]> => {
      const { data, error } = await supabase
        .from("non_conformances")
        .select(`
          *,
          department:departments(name, group_type)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar não conformidades:", error);
        throw new Error("Erro ao carregar não conformidades");
      }

      // Converter os dados brutos para o formato NonConformance[]
      return (data || []).map(item => {
        const { department, ...rest } = item;
        return {
          ...rest,
          status: rest.status as 'pending' | 'in-progress' | 'completed' | 'critical', // Garantir que o status tenha o tipo correto
          department: department
        } as NonConformance;
      });
    },
    enabled: !!user, // Só executa quando o usuário está autenticado
  });

  // Criar uma nova não conformidade
  const createNonConformance = useMutation({
    mutationFn: async (nonConformance: NonConformanceInput) => {
      // Formatar datas para ISO string
      const formattedOccurrenceDate = nonConformance.occurrence_date 
        ? new Date(nonConformance.occurrence_date).toISOString() 
        : new Date().toISOString();
        
      const formattedDeadlineDate = nonConformance.deadline_date 
        ? new Date(nonConformance.deadline_date).toISOString() 
        : null;
      
      // Criar o objeto de inserção sem o campo 'code' que é gerado pelo trigger
      const newNonConformance = {
        ...nonConformance,
        occurrence_date: formattedOccurrenceDate,
        deadline_date: formattedDeadlineDate,
        created_by: user?.id || null
      };

      const { data, error } = await supabase
        .from("non_conformances")
        .insert(newNonConformance)
        .select("*")
        .single();

      if (error) {
        console.error("Erro ao criar não conformidade:", error);
        setError(`Erro ao criar não conformidade: ${error.message}`);
        throw new Error(`Erro ao criar não conformidade: ${error.message}`);
      }

      setError(null);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["non_conformances"] });
    },
  });

  // Upload de arquivos para uma não conformidade
  const uploadFiles = async (nonConformanceId: string, files: File[]) => {
    if (!files.length) return [];
    
    try {
      const uploadResults = [];
      
      for (const file of files) {
        // 1. Upload do arquivo para o storage
        const filePath = `${nonConformanceId}/${file.name}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from("non_conformance_files")
          .upload(filePath, file);
        
        if (storageError) {
          console.error("Erro no upload do arquivo:", storageError);
          continue;
        }
        
        // 2. Registro do arquivo na tabela non_conformance_files
        const { data: fileRecord, error: fileError } = await supabase
          .from("non_conformance_files")
          .insert({
            non_conformance_id: nonConformanceId,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
            uploaded_by: user?.id
          })
          .select("*")
          .single();
          
        if (fileError) {
          console.error("Erro ao registrar arquivo:", fileError);
          continue;
        }
        
        uploadResults.push(fileRecord);
      }
      
      return uploadResults;
    } catch (error) {
      console.error("Erro ao processar arquivos:", error);
      throw error;
    }
  };

  return {
    getNonConformances,
    createNonConformance,
    uploadFiles,
    error,
    setError
  };
};
