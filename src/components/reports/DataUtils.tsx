
import { NonConformance } from "@/hooks/useNonConformances";

export const generateDepartmentData = (nonConformances: NonConformance[]) => {
  const departmentMap = new Map();
  const departmentIds = new Map();
  const departmentDescriptions = new Map();
  
  nonConformances.forEach(nc => {
    const deptName = nc.department?.name || "Não especificado";
    if (!departmentMap.has(deptName)) {
      departmentMap.set(deptName, 0);
      departmentIds.set(deptName, []);
      departmentDescriptions.set(deptName, []);
    }
    departmentMap.set(deptName, departmentMap.get(deptName) + 1);
    departmentIds.get(deptName).push(nc.id);
    departmentDescriptions.get(deptName).push(nc.title);
  });
  
  return Array.from(departmentMap.entries()).map(([name, value]) => ({
    name,
    value,
    id: departmentIds.get(name),
    descriptions: departmentDescriptions.get(name)
  }));
};

export const generateStatusData = (nonConformances: NonConformance[]) => {
  const statusMap = new Map();
  const statusIds = new Map();
  const statusDescriptions = new Map();
  const statusColors = {
    'pending': '#3B82F6',
    'in-progress': '#FBBF24',
    'resolved': '#10B981',
    'closed': '#10B981'
  };
  
  nonConformances.forEach(nc => {
    const statusName = nc.status === 'pending' ? 'Pendente' :
                     nc.status === 'in-progress' ? 'Em Andamento' :
                     nc.status === 'resolved' ? 'Resolvida' :
                     nc.status === 'closed' ? 'Encerrada' : nc.status;
    
    if (!statusMap.has(statusName)) {
      statusMap.set(statusName, 0);
      statusIds.set(statusName, []);
      statusDescriptions.set(statusName, []);
    }
    statusMap.set(statusName, statusMap.get(statusName) + 1);
    statusIds.get(statusName).push(nc.id);
    statusDescriptions.get(statusName).push(nc.title);
  });
  
  return Array.from(statusMap.entries()).map(([name, value]) => {
    const statusKey = name === 'Pendente' ? 'pending' :
                    name === 'Em Andamento' ? 'in-progress' :
                    name === 'Resolvida' ? 'resolved' :
                    name === 'Encerrada' ? 'closed' : '';
                    
    return {
      name,
      value,
      id: statusIds.get(name),
      descriptions: statusDescriptions.get(name),
      color: statusColors[statusKey as keyof typeof statusColors]
    };
  });
};

export const generateMonthlyData = (nonConformances: NonConformance[]) => {
  const monthlyMap = new Map();
  const monthlyIds = new Map();
  const monthlyDescriptions = new Map();
  
  // Inicializar todos os meses
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];
  
  months.forEach(month => {
    monthlyMap.set(month, 0);
    monthlyIds.set(month, []);
    monthlyDescriptions.set(month, []);
  });
  
  // Contar não conformidades por mês
  nonConformances.forEach(nc => {
    const date = new Date(nc.occurrence_date);
    const month = months[date.getMonth()];
    
    monthlyMap.set(month, monthlyMap.get(month) + 1);
    monthlyIds.get(month).push(nc.id);
    monthlyDescriptions.get(month).push(nc.title);
  });
  
  return Array.from(monthlyMap.entries()).map(([month, value]) => ({
    name: month,
    value,
    id: monthlyIds.get(month),
    descriptions: monthlyDescriptions.get(month)
  }));
};
