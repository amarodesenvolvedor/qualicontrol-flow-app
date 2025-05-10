
interface NonConformance {
  id: string;
  department?: {
    name: string;
  } | null;
  status: string;
}

export const generateDepartmentData = (nonConformances: NonConformance[]) => {
  const departmentMap = new Map();
  const departmentIds = new Map();
  
  nonConformances.forEach(nc => {
    const deptName = nc.department?.name || "Não especificado";
    if (!departmentMap.has(deptName)) {
      departmentMap.set(deptName, 0);
      departmentIds.set(deptName, []);
    }
    departmentMap.set(deptName, departmentMap.get(deptName) + 1);
    departmentIds.get(deptName).push(nc.id);
  });
  
  return Array.from(departmentMap.entries()).map(([name, value]) => ({
    name,
    value,
    id: departmentIds.get(name)
  }));
};

export const generateStatusData = (nonConformances: NonConformance[]) => {
  const statusMap = new Map();
  const statusIds = new Map();
  const statusColors = {
    'pending': '#3B82F6',
    'in-progress': '#FBBF24',
    'completed': '#10B981',
    'critical': '#EF4444'
  };
  
  nonConformances.forEach(nc => {
    const statusName = nc.status === 'pending' ? 'Pendente' :
                     nc.status === 'in-progress' ? 'Em Andamento' :
                     nc.status === 'completed' ? 'Concluído' :
                     nc.status === 'critical' ? 'Crítico' : nc.status;
    
    if (!statusMap.has(statusName)) {
      statusMap.set(statusName, 0);
      statusIds.set(statusName, []);
    }
    statusMap.set(statusName, statusMap.get(statusName) + 1);
    statusIds.get(statusName).push(nc.id);
  });
  
  return Array.from(statusMap.entries()).map(([name, value]) => {
    const statusKey = name === 'Pendente' ? 'pending' :
                    name === 'Em Andamento' ? 'in-progress' :
                    name === 'Concluído' ? 'completed' :
                    name === 'Crítico' ? 'critical' : '';
                    
    return {
      name,
      value,
      id: statusIds.get(name),
      color: statusColors[statusKey as keyof typeof statusColors]
    };
  });
};
