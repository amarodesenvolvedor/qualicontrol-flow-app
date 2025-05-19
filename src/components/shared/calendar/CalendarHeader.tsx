
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarViewType } from './types';

interface CalendarHeaderProps {
  currentDate: Date;
  currentView: CalendarViewType;
  onPrevious: () => void;
  onNext: () => void;
}

export const CalendarHeader = ({
  currentDate,
  currentView,
  onPrevious,
  onNext
}: CalendarHeaderProps) => {
  if (currentView === 'month') {
    return (
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <Button variant="outline" size="icon" onClick={onNext}>
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
      <Button variant="outline" size="icon" onClick={onPrevious}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-lg font-semibold">
        {format(start, 'dd/MM/yyyy')} - {format(end, 'dd/MM/yyyy')}
      </h2>
      <Button variant="outline" size="icon" onClick={onNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
