
import { Badge } from "@/components/ui/badge";
import { NonConformance } from "@/types/nonConformance";

interface StatusBadgeProps {
  status: NonConformance['status'];
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusBadgeColor = (status: NonConformance['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'in-progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'resolved': return 'bg-green-500 hover:bg-green-600';
      case 'closed': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getTranslatedStatus = (status: NonConformance['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in-progress': return 'Em Andamento';
      case 'resolved': return 'Resolvido';
      case 'closed': return 'Encerrado';
      default: return status;
    }
  };

  return (
    <Badge className={getStatusBadgeColor(status)}>
      {getTranslatedStatus(status)}
    </Badge>
  );
};

export default StatusBadge;
