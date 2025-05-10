
import { InteractiveChart } from "@/components/reports/InteractiveChart";
import { ScheduledReports } from "@/components/reports/ScheduledReports";
import { generateDepartmentData, generateStatusData } from "@/components/reports/DataUtils";

interface ScheduledReportsTabProps {
  nonConformances: any[];
}

export const ScheduledReportsTab = ({ nonConformances }: ScheduledReportsTabProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <ScheduledReports />
      </div>
      <div className="md:col-span-2">
        <div className="space-y-4">
          <InteractiveChart 
            title="Não Conformidades por Departamento" 
            data={generateDepartmentData(nonConformances)}
            type="pie"
            height={350}
          />
          <InteractiveChart 
            title="Status das Não Conformidades" 
            data={generateStatusData(nonConformances)}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};
