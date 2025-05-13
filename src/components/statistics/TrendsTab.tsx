
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InteractiveChart } from "@/components/reports/InteractiveChart";
import { DataItem } from "@/components/charts/types";

interface TrendsTabProps {
  trendData: DataItem[];
}

export const TrendsTab = ({ trendData }: TrendsTabProps) => {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Não Conformidades</CardTitle>
          <CardDescription>Evolução mensal por status</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[400px]">
            <InteractiveChart
              title=""
              data={trendData}
              type="line"
              dataKey="value"
              height={400}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
