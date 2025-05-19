
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'audit' | 'nonconformance';
  status: string;
  color?: string;
  entityType?: 'report' | 'scheduled';
}

export interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onFilterChange?: (filters: any) => void;
  activeFilters?: string[];
}

export type CalendarViewType = 'month' | 'week';
