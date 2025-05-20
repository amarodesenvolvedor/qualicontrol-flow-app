
/**
 * Status mapping for non-conformance statuses
 */
export const statusMap: Record<string, string> = {
  'pending': 'Pendente',
  'in-progress': 'Em Andamento',
  'resolved': 'Resolvido',
  'closed': 'Encerrado',
};

/**
 * Get color for status badge
 * 
 * @param status The status string
 * @returns RGB color array [r, g, b]
 */
export const getStatusColor = (status: string): [number, number, number] => {
  switch (status) {
    case 'resolved':
    case 'closed':
      return [0, 150, 50]; // Green for completed statuses
    case 'in-progress':
      return [230, 140, 0]; // Orange for in progress
    default:
      return [220, 50, 50]; // Red for pending
  }
};
