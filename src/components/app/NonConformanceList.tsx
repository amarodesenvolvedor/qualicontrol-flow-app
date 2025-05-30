
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, Filter } from "lucide-react";
import { NonConformance } from "@/hooks/useNonConformances";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import StatusBadge from "./nonconformance/details/StatusBadge";
import { isCritical } from "@/components/dashboard/utils/dashboardHelpers";

interface NonConformanceListProps {
  nonConformances: NonConformance[];
  isLoading: boolean;
  refetch: () => void;
  deleteNonConformance: (id: string) => Promise<void>;
}

const NonConformanceList = ({ 
  nonConformances, 
  isLoading, 
  refetch, 
  deleteNonConformance
}: NonConformanceListProps) => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleView = (id: string) => {
    navigate(`/nao-conformidades/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/nao-conformidades/${id}/editar`);
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedId) {
      try {
        setIsDeleting(true);
        await deleteNonConformance(selectedId);
        toast({
          title: "Não conformidade excluída",
          description: "O registro foi removido com sucesso.",
        });
        refetch();
      } catch (error) {
        console.error("Error deleting non-conformance:", error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o registro.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
        setDeleteDialogOpen(false);
      }
    }
  };

  const getDeadlineStatus = (nc: NonConformance) => {
    if (!nc.response_date) return null;
    
    const responseDate = new Date(nc.response_date);
    const now = new Date();
    
    if (responseDate < now && nc.status === "pending") {
      return <Badge className="bg-red-500 hover:bg-red-600">Vencido</Badge>;
    } else if (nc.status === "pending") {
      return <Badge className="bg-green-500 hover:bg-green-600">No Prazo</Badge>;
    } else {
      return <Badge className="bg-gray-500 hover:bg-gray-600">Concluído</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Não Conformidades</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Carregando não conformidades...</p>
            </div>
          ) : nonConformances.length === 0 ? (
            <div className="flex justify-center py-8">
              <p>Nenhuma não conformidade encontrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Requisito ISO</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Situação do Prazo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nonConformances.map((nc) => (
                    <TableRow key={nc.id}>
                      <TableCell className="font-medium">{nc.code}</TableCell>
                      <TableCell>
                        {nc.title}
                        {isCritical(nc) && (
                          <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-200">
                            Crítico
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{nc.department?.name || '-'}</TableCell>
                      <TableCell>{nc.iso_requirement || '-'}</TableCell>
                      <TableCell>
                        <StatusBadge status={nc.status} />
                      </TableCell>
                      <TableCell>{new Date(nc.occurrence_date).toLocaleDateString()}</TableCell>
                      <TableCell>{nc.response_date ? new Date(nc.response_date).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{getDeadlineStatus(nc)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleView(nc.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(nc.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(nc.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta não conformidade? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700" 
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NonConformanceList;
