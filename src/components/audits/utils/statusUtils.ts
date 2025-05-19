
export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'programada':
    case 'pending': 
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'agendada':
    case 'in_progress': 
      return 'bg-blue-500 hover:bg-blue-600';
    case 'concluida':
    case 'completed': 
      return 'bg-green-500 hover:bg-green-600';
    case 'atrasada':
      return 'bg-red-500 hover:bg-red-600';
    default: 
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

export const getStatusDisplayName = (status: string) => {
  switch (status) {
    case 'programada': 
      return 'Programada';
    case 'agendada': 
      return 'Agendada';
    case 'concluida': 
      return 'Concluída';
    case 'atrasada': 
      return 'Atrasada';
    case 'pending': 
      return 'Pendente';
    case 'in_progress': 
      return 'Em Andamento';
    case 'completed': 
      return 'Concluída';
    default: 
      return status;
  }
};
