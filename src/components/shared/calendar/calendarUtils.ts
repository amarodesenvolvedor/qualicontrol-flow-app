
import { endOfWeek } from 'date-fns';
import { CalendarEvent } from "@/components/shared/calendar/types";

// Different styling based on event type and status
export const getEventStyle = (event: CalendarEvent): string => {
  if (event.entityType === 'scheduled') {
    switch (event.status) {
      case 'programada':
        return 'bg-blue-100 text-blue-800 border-l-4 border-l-blue-500';
      case 'agendada':
        return 'bg-amber-100 text-amber-800 border-l-4 border-l-amber-500';
      case 'concluida':
        return 'bg-green-100 text-green-800 border-l-4 border-l-green-500';
      case 'atrasada':
        return 'bg-red-100 text-red-800 border-l-4 border-l-red-500';
      default:
        return 'bg-blue-100 text-blue-800 border-l-4 border-l-blue-500';
    }
  } else {
    return event.type === 'audit' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-amber-100 text-amber-800';
  }
};

// Filter events by date and active filters
export const getEventsByDate = (
  date: Date, 
  events: CalendarEvent[], 
  activeFilters: string[]
): CalendarEvent[] => {
  return events.filter(event => {
    // Check if the date matches
    const eventDate = new Date(event.date);
    const isSameDay = eventDate.getDate() === date.getDate() &&
                      eventDate.getMonth() === date.getMonth() &&
                      eventDate.getFullYear() === date.getFullYear();
                      
    // Apply filters
    const passesFilter = activeFilters.length === 0 || 
      (activeFilters.includes(event.type) || 
       (activeFilters.includes('scheduled') && event.entityType === 'scheduled') ||
       (activeFilters.includes('critical') && event.status === 'critical') ||
       (activeFilters.includes('pending') && ['pending', 'in-progress', 'scheduled', 'programada'].includes(event.status)) ||
       (activeFilters.includes('dueThisWeek') && 
        new Date(event.date) <= endOfWeek(new Date()) && 
        new Date(event.date) >= new Date())
      );
      
    return isSameDay && passesFilter;
  });
};
