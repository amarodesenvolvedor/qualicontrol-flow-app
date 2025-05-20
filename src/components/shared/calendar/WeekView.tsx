
import { format, isSameDay, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from './types';
import { getEventStyle, getEventsByDate } from './calendarUtils';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  activeFilters: string[];
  onEventClick: (event: CalendarEvent) => void;
}

export const WeekView = ({ 
  currentDate, 
  events, 
  activeFilters, 
  onEventClick 
}: WeekViewProps) => {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  const days = [];
  let day = startDate;
  
  while (day <= endDate) {
    const dayEvents = getEventsByDate(day, events, activeFilters);
    
    days.push(
      <div key={day.toString()} className="mb-4">
        <div className={`flex items-center mb-2 ${
          isSameDay(day, new Date()) ? 'font-bold' : ''
        }`}>
          <div className="w-24 text-sm">
            {format(day, 'EEEE', { locale: ptBR })}
          </div>
          <div className="text-sm">
            {format(day, 'dd/MM')}
          </div>
        </div>
        <div className="pl-24 space-y-2">
          {dayEvents.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">
              Nenhum evento
            </div>
          ) : (
            dayEvents.map((event, idx) => (
              <div
                key={idx}
                onClick={() => onEventClick(event)}
                className={`p-2 rounded-md cursor-pointer ${getEventStyle(event)}`}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(event.date), 'HH:mm')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
    
    day = addDays(day, 1);
  }
  
  return <div className="space-y-2">{days}</div>;
};
