
export interface ReportConfig {
  title: string;
  dateRange: {
    start?: Date;
    end?: Date;
  };
  filters: {
    departments: string[];
    status: string[];
    category: string[];
  };
  groupBy: string;
  chartType: "bar" | "pie" | "line";
}

export interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  email: string;
  reportType: string;
  active: boolean;
}
