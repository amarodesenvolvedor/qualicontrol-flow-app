
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelectFilter } from "@/components/shared/filters";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ComparisonFiltersProps {
  availableYears: string[];
  year1: string;
  year2: string;
  selectedDepartments: string[];
  departments: any[];
  isComparing: boolean;
  onYear1Change: (year: string) => void;
  onYear2Change: (year: string) => void;
  onDepartmentChange: (departments: string[]) => void;
  onCompare: () => void;
}

export const ComparisonFilters = ({
  availableYears,
  year1,
  year2,
  selectedDepartments,
  departments,
  isComparing,
  onYear1Change,
  onYear2Change,
  onDepartmentChange,
  onCompare,
}: ComparisonFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div>
        <label className="text-sm font-medium block mb-2">Ano 1</label>
        <Select value={year1} onValueChange={onYear1Change}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o ano" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-40">
              {availableYears.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">Ano 2</label>
        <Select value={year2} onValueChange={onYear2Change}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o ano" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-40">
              {availableYears.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">Departamentos</label>
        <MultiSelectFilter
          label="Selecionar departamentos"
          options={departments.map(dept => ({ value: dept.id || "", label: dept.name }))}
          selectedValues={selectedDepartments}
          onChange={onDepartmentChange}
        />
      </div>
      <div className="lg:col-span-3 flex justify-end">
        <Button onClick={onCompare} disabled={!year1 || !year2 || isComparing} className="bg-primary hover:bg-primary/90">
          {isComparing ? "Processando..." : "Comparar"}
        </Button>
      </div>
    </div>
  );
};
