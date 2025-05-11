
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";

interface NonConformanceListProps {
  nonConformances: NonConformance[];
  isLoading: boolean;
  refetch: () => void;
  deleteNonConformance: (id: string) => void;
}

const NonConformanceList = ({ 
  nonConformances, 
  isLoading, 
  refetch, 
  deleteNonConformance
}: NonConformanceListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getStatusBadgeColor = (status: NonConformance['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'in-progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'resolved': return 'bg-green-500 hover:bg-green-600';
      case 'closed': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

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
        await deleteNonConformance(selectedId);
        toast({
          title: "Não conformidade excluída",
          description: "O registro foi removido com sucesso.",
        });
        refetch();
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o registro.",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
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
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nonConformances.map((nc) => (
                    <TableRow key={nc.id}>
                      <TableCell className="font-medium">{nc.code}</TableCell>
                      <TableCell>{nc.title}</TableCell>
                      <TableCell>{nc.department?.name || '-'}</TableCell>
                      <TableCell>{nc.category}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(nc.status)}>
                          {nc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(nc.occurrence_date).toLocaleDateString()}</TableCell>
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
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NonConformanceList;
