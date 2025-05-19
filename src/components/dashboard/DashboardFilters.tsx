
import { Slider } from "@/components/ui/slider";
import { DateRangeFilter } from "@/components/shared/filters/DateRangeFilter";
import { MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL, ZOOM_STEP } from "@/components/dashboard/constants/dashboardConfig";

interface DashboardFiltersProps {
  dateRange: { from: Date | null; to: Date | null } | null;
  onDateRangeChange: (range: { from: Date | null; to: Date | null } | null) => void;
  zoomLevel: number[];
  onZoomChange: (value: number[]) => void;
}

const DashboardFilters = ({ 
  dateRange, 
  onDateRangeChange, 
  zoomLevel, 
  onZoomChange 
}: DashboardFiltersProps) => {
  return (
    <div className="p-3 sm:p-4 bg-card rounded-lg border shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <h3 className="text-sm font-medium mb-2">Filtro por Período</h3>
          <DateRangeFilter 
            value={dateRange} 
            onChange={onDateRangeChange} 
          />
        </div>
        
        <div className="w-full">
          <h3 className="text-sm font-medium mb-2">Ajustar visualização</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{MIN_ZOOM_LEVEL}%</span>
            <Slider
              value={zoomLevel}
              onValueChange={onZoomChange}
              min={MIN_ZOOM_LEVEL}
              max={MAX_ZOOM_LEVEL}
              step={ZOOM_STEP}
              className="cursor-pointer flex-1 max-w-[200px] sm:max-w-full"
            />
            <span className="text-xs text-muted-foreground">{MAX_ZOOM_LEVEL}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
