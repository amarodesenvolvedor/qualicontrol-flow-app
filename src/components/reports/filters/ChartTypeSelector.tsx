
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BarChart3, PieChart, LineChart } from "lucide-react";

interface ChartTypeSelectorProps {
  selectedType: "bar" | "pie" | "line";
  onChange: (type: "bar" | "pie" | "line") => void;
}

export const ChartTypeSelector = ({ selectedType, onChange }: ChartTypeSelectorProps) => {
  return (
    <div>
      <Label>Tipo de Gráfico</Label>
      <div className="flex space-x-2 mt-2">
        <Button 
          variant={selectedType === "bar" ? "default" : "outline"}
          size="sm"
          onClick={() => onChange("bar")}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Barras
        </Button>
        <Button 
          variant={selectedType === "pie" ? "default" : "outline"}
          size="sm"
          onClick={() => onChange("pie")}
        >
          <PieChart className="mr-2 h-4 w-4" />
          Pizza
        </Button>
        <Button 
          variant={selectedType === "line" ? "default" : "outline"}
          size="sm"
          onClick={() => onChange("line")}
        >
          <LineChart className="mr-2 h-4 w-4" />
          Linha
        </Button>
      </div>
    </div>
  );
};
