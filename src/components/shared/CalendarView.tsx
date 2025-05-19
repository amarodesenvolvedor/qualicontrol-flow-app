
import { useState } from 'react';
import { addDays, endOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarHeader } from './calendar/CalendarHeader';
import { CalendarFilters } from './calendar/CalendarFilters';
import { MonthView } from './calendar/MonthView';
import { WeekView } from './calendar/WeekView';
import { CalendarViewProps, CalendarViewType } from './calendar/types';

export type { CalendarEvent } from './calendar/types';

export const CalendarView = ({ 
  events, 
  onEventClick, 
  onFilterChange,
  activeFilters = [] 
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarViewType>('month');

  const nextMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1);
    setCurrentDate(date);
  };

  const prevMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - 1);
    setCurrentDate(date);
  };

  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const prevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNext = currentView === 'month' ? nextMonth : nextWeek;
  const handlePrevious = currentView === 'month' ? prevMonth : prevWeek;
  
  const handleFilterChange = (newFilters: string[]) => {
    onFilterChange?.(newFilters);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Calendário</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={currentView === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('month')}
            >
              Mês
            </Button>
            <Button
              variant={currentView === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('week')}
            >
              Semana
            </Button>
          </div>
        </div>
        <CalendarFilters 
          activeFilters={activeFilters} 
          onFilterChange={handleFilterChange}
        />
      </CardHeader>
      <CardContent>
        <CalendarHeader
          currentDate={currentDate}
          currentView={currentView}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
        
        {currentView === 'month' ? (
          <MonthView
            currentDate={currentDate}
            events={events}
            activeFilters={activeFilters}
            onEventClick={onEventClick}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            events={events}
            activeFilters={activeFilters}
            onEventClick={onEventClick}
          />
        )}
      </CardContent>
    </Card>
  );
};
