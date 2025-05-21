
import { FC } from "react";

export interface OverviewTabProps {
  selectedYear: string;
}

export const OverviewTab: FC<OverviewTabProps> = ({ selectedYear }) => {
  return (
    <div className="space-y-4">
      <h2>Visão Geral - {selectedYear}</h2>
      {/* Overview content goes here */}
    </div>
  );
};
