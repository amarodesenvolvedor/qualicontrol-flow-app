
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Eye, Filter } from "lucide-react";
import { NonConformance } from "@/hooks/useNonConformances";

interface NonConformanceListProps {
  nonConformances: NonConformance[];
  isLoading: boolean;
  refetch: () => void;
}

const NonConformanceList = ({ nonConformances, isLoading, refetch }: NonConformanceListProps) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const getStatusBadgeColor = (status: NonConformance['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'in-progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'resolved': return 'bg-green-500 hover:bg-green-600';
      case 'closed': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
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
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
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
  );
};

export default NonConformanceList;
