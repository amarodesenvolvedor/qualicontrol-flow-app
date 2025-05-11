
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Department = {
  id: string;
  name: string;
  description: string | null;
  group_type: "corporate" | "regional";
};

export const useDepartments = () => {
  const query = useQuery({
    queryKey: ["departments"],
    queryFn: async (): Promise<Department[]> => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Erro ao buscar departamentos:", error);
        throw new Error("Erro ao carregar departamentos");
      }
      
      return data || [];
    },
  });
  
  return {
    departments: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error
  };
};
