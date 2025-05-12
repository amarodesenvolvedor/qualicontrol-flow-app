
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
  // Departamentos corporativos
  { id: "1", name: "Almoxarifado", description: "Departamento de Almoxarifado", group_type: "corporate" },
  { id: "2", name: "Engenharia de Desenvolvimento", description: "Departamento de Engenharia de Desenvolvimento", group_type: "corporate" },
  { id: "3", name: "Engenharia de Processos", description: "Departamento de Engenharia de Processos", group_type: "corporate" },
  { id: "4", name: "Garantia da Qualidade", description: "Departamento de Garantia da Qualidade", group_type: "corporate" },
  { id: "5", name: "Logística de Distribuição", description: "Departamento de Logística de Distribuição", group_type: "corporate" },
  { id: "6", name: "Manutenção", description: "Departamento de Manutenção", group_type: "corporate" },
  { id: "7", name: "Montagem", description: "Departamento de Montagem", group_type: "corporate" },
  { id: "8", name: "Planejamento", description: "Departamento de Planejamento", group_type: "corporate" },
  { id: "9", name: "Prédio 110", description: "Prédio 110", group_type: "corporate" },
  { id: "10", name: "Prédio 120", description: "Prédio 120", group_type: "corporate" },
  { id: "11", name: "Prédio 130 (Tratamento Térmico)", description: "Prédio 130 (Tratamento Térmico)", group_type: "corporate" },
  { id: "12", name: "Prédio 140", description: "Prédio 140", group_type: "corporate" },
  { id: "13", name: "Prédio 150", description: "Prédio 150", group_type: "corporate" },
  { id: "14", name: "Prédio 170", description: "Prédio 170", group_type: "corporate" },
  { id: "15", name: "Recursos Humanos", description: "Departamento de Recursos Humanos", group_type: "corporate" },
  { id: "16", name: "Service", description: "Departamento de Service", group_type: "corporate" },
  { id: "17", name: "Suprimentos", description: "Departamento de Suprimentos", group_type: "corporate" },
  { id: "18", name: "Tecnologia da Informação", description: "Departamento de Tecnologia da Informação", group_type: "corporate" },
  { id: "19", name: "Wiepro", description: "Departamento Wiepro", group_type: "corporate" },
  { id: "20", name: "Alta Direção", description: "Alta Direção", group_type: "corporate" },
  { id: "21", name: "Ambulatório", description: "Ambulatório", group_type: "corporate" },
  { id: "22", name: "Central de Resíduos (limpeza/jardinagem)", description: "Central de Resíduos", group_type: "corporate" },
  { id: "23", name: "Recepção / Portaria / Vigilância / Estacionamento", description: "Serviços de acesso", group_type: "corporate" },
  { id: "24", name: "Restaurante", description: "Restaurante", group_type: "corporate" },
  { id: "25", name: "Segurança e Meio Ambiente", description: "Departamento de Segurança e Meio Ambiente", group_type: "corporate" },
  { id: "26", name: "Atmosferas Explosivas (Geral)", description: "Atmosferas Explosivas (Geral)", group_type: "corporate" },
  
  // Departamentos regionais
  { id: "27", name: "Arujá - Vendas", description: "Filial Arujá - Vendas", group_type: "regional" },
  { id: "28", name: "Arujá - Service", description: "Filial Arujá - Service", group_type: "regional" },
  { id: "29", name: "Bahia - Vendas", description: "Filial Bahia - Vendas", group_type: "regional" },
  { id: "30", name: "Bahia - Service", description: "Filial Bahia - Service", group_type: "regional" },
  { id: "31", name: "Contagem - Vendas", description: "Filial Contagem - Vendas", group_type: "regional" },
  { id: "32", name: "Contagem - Service", description: "Filial Contagem - Service", group_type: "regional" },
  { id: "33", name: "Ceará - Vendas", description: "Filial Ceará - Vendas", group_type: "regional" },
  { id: "34", name: "Ceará - Service", description: "Filial Ceará - Service", group_type: "regional" },
  { id: "35", name: "Chapecó - Vendas", description: "Filial Chapecó - Vendas", group_type: "regional" },
  { id: "36", name: "Chapecó - Service", description: "Filial Chapecó - Service", group_type: "regional" },
  { id: "37", name: "Espírito Santo - Vendas", description: "Filial Espírito Santo - Vendas", group_type: "regional" },
  { id: "38", name: "Espírito Santo - Service", description: "Filial Espírito Santo - Service", group_type: "regional" },
  { id: "39", name: "Goiás - Vendas", description: "Filial Goiás - Vendas", group_type: "regional" },
  { id: "40", name: "Goiás - Service", description: "Filial Goiás - Service", group_type: "regional" },
  { id: "41", name: "Mato Grosso - Vendas", description: "Filial Mato Grosso - Vendas", group_type: "regional" },
  { id: "42", name: "Mato Grosso - Service", description: "Filial Mato Grosso - Service", group_type: "regional" },
  { id: "43", name: "Pará - Vendas", description: "Filial Pará - Vendas", group_type: "regional" },
  { id: "44", name: "Pará - Service", description: "Filial Pará - Service", group_type: "regional" },
  { id: "45", name: "Paraná - Vendas", description: "Filial Paraná - Vendas", group_type: "regional" },
  { id: "46", name: "Paraná - Service", description: "Filial Paraná - Service", group_type: "regional" },
  { id: "47", name: "Pernambuco - Vendas", description: "Filial Pernambuco - Vendas", group_type: "regional" },
  { id: "48", name: "Pernambuco - Service", description: "Filial Pernambuco - Service", group_type: "regional" },
  { id: "49", name: "Rio de Janeiro - Vendas", description: "Filial Rio de Janeiro - Vendas", group_type: "regional" },
  { id: "50", name: "Rio de Janeiro - Service", description: "Filial Rio de Janeiro - Service", group_type: "regional" },
  { id: "51", name: "Rio Grande do Sul - Vendas", description: "Filial Rio Grande do Sul - Vendas", group_type: "regional" },
  { id: "52", name: "Rio Grande do Sul - Service", description: "Filial Rio Grande do Sul - Service", group_type: "regional" },
  { id: "53", name: "Uberlândia - Service", description: "Filial Uberlândia - Service", group_type: "regional" },
  { id: "54", name: "Joinville - Vendas", description: "Filial Joinville - Vendas", group_type: "regional" },
  { id: "55", name: "Joinville - Recebimento e Almoxarifado", description: "Filial Joinville - Recebimento e Almoxarifado", group_type: "regional" },
  { id: "56", name: "Joinville - Planejamento", description: "Filial Joinville - Planejamento", group_type: "regional" },
  { id: "57", name: "Joinville - Logística de Distribuição", description: "Filial Joinville - Logística de Distribuição", group_type: "regional" },
  { id: "58", name: "Joinville - Service", description: "Filial Joinville - Service", group_type: "regional" },
  { id: "59", name: "Joinville - Manutenção", description: "Filial Joinville - Manutenção", group_type: "regional" },
  { id: "60", name: "Joinville - RH", description: "Filial Joinville - RH", group_type: "regional" },
  { id: "61", name: "Joinville - Montagem", description: "Filial Joinville - Montagem", group_type: "regional" },
  { id: "62", name: "Rio Claro - Vendas", description: "Filial Rio Claro - Vendas", group_type: "regional" },
  { id: "63", name: "Rio Claro - Recebimento e Almoxarifado", description: "Filial Rio Claro - Recebimento e Almoxarifado", group_type: "regional" },
  { id: "64", name: "Rio Claro - Planejamento", description: "Filial Rio Claro - Planejamento", group_type: "regional" },
  { id: "65", name: "Rio Claro - Logística de Distribuição", description: "Filial Rio Claro - Logística de Distribuição", group_type: "regional" },
  { id: "66", name: "Rio Claro - Service", description: "Filial Rio Claro - Service", group_type: "regional" },
  { id: "67", name: "Rio Claro - Manutenção", description: "Filial Rio Claro - Manutenção", group_type: "regional" },
  { id: "68", name: "Rio Claro - RH", description: "Filial Rio Claro - RH", group_type: "regional" },
  { id: "69", name: "Rio Claro - Montagem", description: "Filial Rio Claro - Montagem", group_type: "regional" },
  { id: "70", name: "Rio Claro - Atmosferas Explosivas", description: "Filial Rio Claro - Atmosferas Explosivas", group_type: "regional" }
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
