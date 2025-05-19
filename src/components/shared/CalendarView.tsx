
import { useState, useMemo } from 'react';
import { addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'audit' | 'nonconformance';
  status: string;
  color?: string;
  entityType?: 'report' | 'scheduled';
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onFilterChange?: (filters: any) => void;
  activeFilters?: string[];
}

export const CalendarView = ({ 
  events, 
  onEventClick, 
  onFilterChange,
  activeFilters = [] 
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week'>('month');

  const filterOptions = [
    { value: 'audit', label: 'Auditorias' },
    { value: 'scheduled', label: 'Auditorias Programadas' },
    { value: 'nonconformance', label: 'Não Conformidades' },
    { value: 'critical', label: 'Críticas' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'dueThisWeek', label: 'Vencendo esta semana' },
  ];

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      onFilterChange?.(activeFilters.filter(f => f !== filter));
    } else {
      onFilterChange?.([...activeFilters, filter]);
    }
  };

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

  const getEventsByDate = (date: Date) => {
    return events.filter(event => {
      // Check if the date matches
      const isSameDay = event.date.getDate() === date.getDate() &&
                        event.date.getMonth() === date.getMonth() &&
                        event.date.getFullYear() === date.getFullYear();
                        
      // Apply filters
      const passesFilter = activeFilters.length === 0 || 
        (activeFilters.includes(event.type) || 
         (activeFilters.includes('scheduled') && event.entityType === 'scheduled') ||
         (activeFilters.includes('critical') && event.status === 'critical') ||
         (activeFilters.includes('pending') && ['pending', 'in-progress', 'scheduled'].includes(event.status)) ||
         (activeFilters.includes('dueThisWeek') && 
          new Date(event.date) <= endOfWeek(new Date()) && 
          new Date(event.date) >= new Date())
        );
        
      return isSameDay && passesFilter;
    });
  };

  const renderHeader = () => {
    if (currentView === 'month') {
      return (
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    // Week view header
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    
    return (
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={prevWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(start, 'dd/MM/yyyy')} - {format(end, 'dd/MM/yyyy')}
        </h2>
        <Button variant="outline" size="icon" onClick={nextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const getEventStyle = (event: CalendarEvent) => {
    // Different styling based on event type and status
    if (event.entityType === 'scheduled') {
      switch (event.status) {
        case 'scheduled':
          return 'bg-blue-100 text-blue-800 border-l-4 border-l-blue-500';
        case 'in_progress':
          return 'bg-amber-100 text-amber-800 border-l-4 border-l-amber-500';
        case 'completed':
          return 'bg-green-100 text-green-800 border-l-4 border-l-green-500';
        case 'cancelled':
          return 'bg-gray-100 text-gray-800 border-l-4 border-l-gray-500';
        default:
          return 'bg-blue-100 text-blue-800 border-l-4 border-l-blue-500';
      }
    } else {
      return event.type === 'audit' 
        ? 'bg-blue-100 text-blue-800' 
        : 'bg-amber-100 text-amber-800';
    }
  };

  const renderMonthView = () => {
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
        const dayEvents = getEventsByDate(cloneDay);
        
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

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    
    const days = [];
    let day = startDate;
    
    while (day <= endDate) {
      const dayEvents = getEventsByDate(day);
      
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
    
    return <div>{days}</div>;
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
        <div className="flex flex-wrap gap-2 mt-2">
          {filterOptions.map(filter => (
            <Badge
              key={filter.value}
              variant={activeFilters.includes(filter.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleFilter(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {renderHeader()}
        {currentView === 'month' ? renderMonthView() : renderWeekView()}
      </CardContent>
    </Card>
  );
};
