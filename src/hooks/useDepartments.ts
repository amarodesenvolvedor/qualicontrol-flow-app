
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Department = {
  id: string;
  name: string;
  description: string | null;
  group_type: "corporate" | "regional";
};

// Dados mockados para usar quando a API falhar
const mockDepartments: Department[] = [
  { id: "1", name: "Produção", description: "Departamento de Produção", group_type: "corporate" },
  { id: "2", name: "Qualidade", description: "Departamento de Qualidade", group_type: "corporate" },
  { id: "3", name: "Manutenção", description: "Departamento de Manutenção", group_type: "corporate" },
  { id: "4", name: "Segurança", description: "Departamento de Segurança", group_type: "corporate" },
  { id: "5", name: "Logística", description: "Departamento de Logística", group_type: "corporate" },
  { id: "6", name: "Administrativo", description: "Departamento Administrativo", group_type: "corporate" }
];

export const useDepartments = () => {
  const query = useQuery({
    queryKey: ["departments"],
    queryFn: async (): Promise<Department[]> => {
      try {
        const { data, error } = await supabase
          .from("departments")
          .select("*")
          .order("name");
        
        if (error) {
          console.error("Erro ao buscar departamentos:", error);
          console.info("Usando dados mockados para departamentos devido a falha na API");
          return mockDepartments;
        }
        
        return data || mockDepartments;
      } catch (error) {
        console.error("Erro na consulta de departamentos:", error);
        console.info("Usando dados mockados para departamentos devido a falha na API");
        return mockDepartments;
      }
    },
  });
  
  // Se não houver dados da API ou ocorrer um erro, retorna os dados mockados
  const departments = query.data || mockDepartments;
  
  return {
    departments,
    isLoading: query.isLoading && !departments.length,
    isError: query.isError,
    error: query.error
  };
};
