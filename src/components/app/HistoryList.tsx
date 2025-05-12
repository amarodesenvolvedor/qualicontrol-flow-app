
import { useState, useEffect } from "react";
import { getEntityHistory, EntityType } from "@/services/historyService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface HistoryListProps {
  entityType: string;
  entityId: string;
}

interface HistoryRecord {
  id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  changed_at: string;
  changed_by: string | null;
  entity_id: string;
}

const HistoryList = ({ entityType, entityId }: HistoryListProps) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const validEntityType = entityType as EntityType;
        // Cast the data to the correct type
        const data = await getEntityHistory(validEntityType, entityId);
        setHistory(data as unknown as HistoryRecord[]);
      } catch (err) {
        setError("Não foi possível carregar o histórico");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (entityId) {
      loadHistory();
    }
  }, [entityType, entityId]);

  const getFieldLabel = (fieldName: string) => {
    const fieldMap: Record<string, string> = {
      title: "Título",
      description: "Descrição",
      status: "Status",
      department_id: "Departamento",
      responsible_name: "Responsável",
      category: "Categoria",
      deadline_date: "Prazo",
      immediate_actions: "Ações Imediatas",
      // Add more field mappings as needed
    };
    
    return fieldMap[fieldName] || fieldName;
  };

  const formatValue = (value: string | null, fieldName: string) => {
    if (value === null) return "Nenhum valor";
    
    if (fieldName.includes("date") && value) {
      try {
        return format(new Date(value), "dd/MM/yyyy HH:mm");
      } catch {
        return value;
      }
    }
    
    return value;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Alterações</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-full my-2" />
          <Skeleton className="h-6 w-full my-2" />
          <Skeleton className="h-6 w-full my-2" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Alterações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Alterações</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground">Nenhuma alteração registrada</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Campo</TableHead>
                  <TableHead>Valor Anterior</TableHead>
                  <TableHead>Novo Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {format(new Date(record.changed_at), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{getFieldLabel(record.field_name)}</TableCell>
                    <TableCell>{formatValue(record.old_value, record.field_name)}</TableCell>
                    <TableCell>{formatValue(record.new_value, record.field_name)}</TableCell>
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

export default HistoryList;
