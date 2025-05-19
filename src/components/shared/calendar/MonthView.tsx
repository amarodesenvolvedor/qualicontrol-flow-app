
import { format, isSameDay, isSameMonth, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from './types';
import { getEventStyle, getEventsByDate } from './calendarUtils';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  activeFilters: string[];
  onEventClick: (event: CalendarEvent) => void;
}

export const MonthView = ({ 
  currentDate, 
  events, 
  activeFilters, 
  onEventClick 
}: MonthViewProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  const rows = [];
  let days = [];
  let day = startDate;

  // Render weekday headers
  const weekdayHeaders = (
    <div className="grid grid-cols-7 text-center font-semibold">
      {weekdays.map(weekday => (
        <div key={weekday} className="py-2">
          {weekday}
        </div>
      ))}
    </div>
  );

  // Render days
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = new Date(day);
      const dayEvents = getEventsByDate(cloneDay, events, activeFilters);
      
      days.push(
        <div
          key={day.toString()}
          className={`min-h-[100px] p-1 border border-border ${
            !isSameMonth(day, monthStart) ? 'bg-muted/30 text-muted-foreground' : ''
          } ${isSameDay(day, new Date()) ? 'bg-primary/10' : ''}`}
        >
          <div className="font-medium text-sm">{format(day, 'd')}</div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 3).map((event, idx) => (
              <div
                key={idx}
                onClick={() => onEventClick(event)}
                className={`text-xs p-1 rounded-sm cursor-pointer truncate ${getEventStyle(event)}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - 3} mais
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="space-y-2">
      {weekdayHeaders}
      <div className="space-y-1">
        {rows}
      </div>
    </div>
  );
};
