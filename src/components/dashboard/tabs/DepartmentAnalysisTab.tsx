
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { NonConformance } from "@/hooks/useNonConformances";

interface DepartmentAnalysisTabProps {
  departmentData: Array<{ name: string; total: number }>;
  nonConformances: NonConformance[];
}

const DepartmentAnalysisTab = ({ departmentData, nonConformances }: DepartmentAnalysisTabProps) => {
  return (
    <Card className="card-glow transition-all hover:shadow-lg duration-300">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CardTitle>Análise por Departamento</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Ajustar visualização:</span>
            <Slider
              defaultValue={[75]}
              max={100}
              step={5}
              className="w-[100px]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left bg-muted/60">
              <tr>
                <th className="p-2 font-medium">Departamento</th>
                <th className="p-2 font-medium">Total</th>
                <th className="p-2 font-medium">Abertas</th>
                <th className="p-2 font-medium">Concluídas</th>
                <th className="p-2 font-medium">Taxa de Resolução</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map((dept, index) => {
                const deptName = dept.name;
                const deptTotal = dept.total;
                const deptOpen = nonConformances.filter(nc => 
                  (nc.department?.name === deptName) && nc.status !== "closed"
                ).length;
                const deptClosed = deptTotal - deptOpen;
                const resolutionRate = deptTotal ? Math.round((deptClosed / deptTotal) * 100) : 0;
                
                return (
                  <tr key={index} className="border-b hover:bg-muted/30 transition-all duration-150">
                    <td className="p-2 font-medium">{deptName}</td>
                    <td className="p-2">{deptTotal}</td>
                    <td className="p-2">{deptOpen}</td>
                    <td className="p-2">{deptClosed}</td>
                    <td className="p-2">
                      <div className="flex items-center">
                        <div className="w-full bg-muted h-2 rounded-full mr-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              resolutionRate > 66 ? 'bg-green-500' : 
                              resolutionRate > 33 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${resolutionRate}%` }}
                          ></div>
                        </div>
                        <span>{resolutionRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentAnalysisTab;
