
import { DataItem } from "@/components/charts/types";

export const generateComparisonData = (
  nonConformances: any[],
  departments: any[],
  year1: string,
  year2: string,
  selectedDepartments: string[]
): DataItem[] => {
  // Ensure inputs are arrays
  if (!Array.isArray(nonConformances) || !Array.isArray(departments)) {
    console.warn("generateComparisonData received non-array input:", { nonConformances, departments });
    return [];
  }
  
  // Filtrar não conformidades por anos selecionados
  const year1Data = nonConformances.filter(nc => {
    if (!nc || !nc.occurrence_date) return false;
    const ncYear = new Date(nc.occurrence_date).getFullYear().toString();
    return ncYear === year1;
  });
  
  const year2Data = nonConformances.filter(nc => {
    if (!nc || !nc.occurrence_date) return false;
    const ncYear = new Date(nc.occurrence_date).getFullYear().toString();
    return ncYear === year2;
  });
  
  // Filtrar por departamentos selecionados, se houver
  const filteredYear1Data = selectedDepartments.length > 0 
    ? year1Data.filter(nc => nc && nc.department_id && selectedDepartments.includes(nc.department_id))
    : year1Data;
    
  const filteredYear2Data = selectedDepartments.length > 0 
    ? year2Data.filter(nc => nc && nc.department_id && selectedDepartments.includes(nc.department_id))
    : year2Data;
  
  // Agrupar por departamento
  const departmentCounts1: Record<string, number> = {};
  const departmentCounts2: Record<string, number> = {};
  const departmentIds: Record<string, string[]> = {};
  const departmentDescriptions: Record<string, string[]> = {};
  
  // Inicializar contagens
  departments.forEach(dept => {
    if (!dept || !dept.name) return;
    departmentCounts1[dept.name] = 0;
    departmentCounts2[dept.name] = 0;
    departmentIds[dept.name] = [];
    departmentDescriptions[dept.name] = [];
  });
  
  // Contar não conformidades por departamento para o ano 1
  filteredYear1Data.forEach(nc => {
    if (!nc || !nc.department_id) return;
    
    const dept = departments.find(d => d && d.id === nc.department_id);
    const deptName = dept?.name || "Não especificado";
    
    departmentCounts1[deptName] = (departmentCounts1[deptName] || 0) + 1;
    
    if (!departmentIds[deptName]) {
      departmentIds[deptName] = [];
      departmentDescriptions[deptName] = [];
    }
    
    if (nc.id) departmentIds[deptName].push(nc.id);
    if (nc.title) departmentDescriptions[deptName].push(nc.title);
  });
  
  // Contar não conformidades por departamento para o ano 2
  filteredYear2Data.forEach(nc => {
    if (!nc || !nc.department_id) return;
    
    const dept = departments.find(d => d && d.id === nc.department_id);
    const deptName = dept?.name || "Não especificado";
    
    departmentCounts2[deptName] = (departmentCounts2[deptName] || 0) + 1;
    
    if (!departmentIds[deptName]) {
      departmentIds[deptName] = [];
      departmentDescriptions[deptName] = [];
    }
    
    if (nc.id) departmentIds[deptName].push(nc.id);
    if (nc.title) departmentDescriptions[deptName].push(nc.title);
  });
  
  // Formatar dados para o gráfico
  const chartData = Object.keys(departmentCounts1)
    .filter(deptName => departmentCounts1[deptName] > 0 || departmentCounts2[deptName] > 0)
    .map((deptName) => {
      // Criar objeto com apenas os dados necessários para comparação
      const chartItem: DataItem = {
        name: deptName,
        value: departmentCounts1[deptName], // Mantemos 'value' como field obrigatório mas não será usado no gráfico
        id: departmentIds[deptName],
        descriptions: departmentDescriptions[deptName]
      };
      
      // Adicionar os valores de cada ano como propriedades separadas
      chartItem[year1] = departmentCounts1[deptName];
      chartItem[year2] = departmentCounts2[deptName];
      
      return chartItem;
    });

  return chartData;
};

export const extractAvailableYears = (nonConformances: any[]): string[] => {
  if (!Array.isArray(nonConformances) || nonConformances.length === 0) {
    return [];
  }
  
  const years = new Set<string>();
  
  nonConformances.forEach(nc => {
    if (nc && nc.occurrence_date) {
      const year = new Date(nc.occurrence_date).getFullYear().toString();
      years.add(year);
    }
  });
  
  return Array.from(years).sort().reverse();
};
