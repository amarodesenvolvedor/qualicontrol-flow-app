
import { FC } from "react";

export interface ComparisonTabProps {
  selectedYear: string;
}

export const ComparisonTab: FC<ComparisonTabProps> = ({ selectedYear }) => {
  return (
    <div className="space-y-4">
      <h2>Comparação - {selectedYear}</h2>
      {/* Comparison content goes here */}
    </div>
  );
};
