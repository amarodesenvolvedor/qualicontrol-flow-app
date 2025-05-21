import { FC } from "react";

export interface TrendsTabProps {
  selectedYear: string;
}

export const TrendsTab: FC<TrendsTabProps> = ({ selectedYear }) => {
  return (
    <div className="space-y-4">
      <h2>Tendências - {selectedYear}</h2>
      {/* Trends content goes here */}
    </div>
  );
};
