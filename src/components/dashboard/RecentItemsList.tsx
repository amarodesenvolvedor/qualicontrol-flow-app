
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NonConformance } from "@/hooks/useNonConformances";

interface RecentItemsListProps {
  recentItems: NonConformance[];
  isUrgent: (nc: NonConformance) => boolean;
}

const RecentItemsList = ({ recentItems, isUrgent }: RecentItemsListProps) => {
  return (
    <Card className="card-scale transition-all hover:shadow-lg duration-300">
      <CardHeader>
        <CardTitle>Não Conformidades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left bg-muted/60">
              <tr>
                <th className="p-2 font-medium">ID</th>
                <th className="p-2 font-medium">Título</th>
                <th className="p-2 font-medium">Departamento</th>
                <th className="p-2 font-medium">Status</th>
                <th className="p-2 font-medium">Data</th>
                <th className="p-2 font-medium">Prazo</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map((item) => {
                const statusMap = {
                  "closed": { label: "Concluído", class: "bg-green-100 text-green-800 border-green-200" },
                  "in-progress": { label: "Em Andamento", class: "bg-amber-100 text-amber-800 border-amber-200" },
                  "pending": { label: "Pendente", class: "bg-blue-100 text-blue-800 border-blue-200" }
                };
                const itemStatus = statusMap[item.status as keyof typeof statusMap] || { label: item.status, class: "" };
                const isItemCritical = item.status === "pending" && isUrgent(item);

                return (
                  <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors duration-200">
                    <td className="p-2">{item.code}</td>
                    <td className="p-2 font-medium">
                      <Link to={`/nao-conformidades/${item.id}`} className="hover:text-primary transition-colors">
                        {item.title}
                      </Link>
                      {isItemCritical && (
                        <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-200">
                          Crítico
                        </Badge>
                      )}
                    </td>
                    <td className="p-2">{item.department?.name}</td>
                    <td className="p-2">
                      <Badge variant="outline" className={`${itemStatus.class} transition-colors duration-200`}>
                        {itemStatus.label}
                      </Badge>
                    </td>
                    <td className="p-2">{new Date(item.occurrence_date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-2">{item.response_date ? new Date(item.response_date).toLocaleDateString('pt-BR') : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" asChild className="transition-all hover:-translate-y-1 duration-200">
            <Link to="/nao-conformidades">Ver todas</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentItemsList;
