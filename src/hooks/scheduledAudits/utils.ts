
import { SupabaseAny } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Gets current ISO week number
export const getCurrentWeek = () => {
  const now = new Date();
  return getWeekNumberForDate(now);
};

// Gets week number for a specific date based on the custom calendar
export const getWeekNumberForDate = (date: Date) => {
  const year = date.getFullYear();
  const weekRanges = getWeekRangesForYear(year);
  
  // Find the week range that contains the date
  for (let i = 0; i < weekRanges.length; i++) {
    const { startDate, endDate } = weekRanges[i];
    if (date >= startDate && date <= endDate) {
      return i + 1; // Week numbers are 1-based
    }
  }
  
  // If no match, it could be from previous or next year
  // Check if the date is before the first week of the year
  if (date < weekRanges[0].startDate) {
    const prevYearWeeks = getWeekRangesForYear(year - 1);
    if (date >= prevYearWeeks[prevYearWeeks.length - 1].startDate) {
      return 52; // Last week of previous year
    }
  }
  
  // Default to week 1 if no match found
  return 1;
};

// Gets current year
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Helper function to parse date strings like "30 de dezembro de 2024"
const parsePortugueseDate = (dateStr: string, year: number) => {
  try {
    // Formato: "d 'de' MMMM" (sem ano)
    const dateWithYear = `${dateStr} de ${year}`;
    const parsedDate = parse(dateWithYear, "d 'de' MMMM 'de' yyyy", new Date(), { locale: ptBR });
    
    // Verificar se a data é válida
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Data inválida: ${dateWithYear}`);
    }
    
    return parsedDate;
  } catch (err) {
    console.error("Erro ao fazer parse da data:", dateStr, year, err);
    // Retorna uma data padrão em caso de erro
    return new Date(year, 0, 1);
  }
};

// Get week ranges for a specific year
const getWeekRangesForYear = (year: number) => {
  // Define week ranges with explicit year handling
  const weekRanges = [
    { start: { text: "1 de janeiro", year }, end: { text: "7 de janeiro", year } }, // Semana 1
    { start: { text: "8 de janeiro", year }, end: { text: "14 de janeiro", year } }, // Semana 2
    { start: { text: "15 de janeiro", year }, end: { text: "21 de janeiro", year } }, // Semana 3
    { start: { text: "22 de janeiro", year }, end: { text: "28 de janeiro", year } }, // Semana 4
    { start: { text: "29 de janeiro", year }, end: { text: "4 de fevereiro", year } }, // Semana 5
    { start: { text: "5 de fevereiro", year }, end: { text: "11 de fevereiro", year } }, // Semana 6
    { start: { text: "12 de fevereiro", year }, end: { text: "18 de fevereiro", year } }, // Semana 7
    { start: { text: "19 de fevereiro", year }, end: { text: "25 de fevereiro", year } }, // Semana 8
    { start: { text: "26 de fevereiro", year }, end: { text: "3 de março", year } }, // Semana 9
    { start: { text: "4 de março", year }, end: { text: "10 de março", year } }, // Semana 10
    { start: { text: "11 de março", year }, end: { text: "17 de março", year } }, // Semana 11
    { start: { text: "18 de março", year }, end: { text: "24 de março", year } }, // Semana 12
    { start: { text: "25 de março", year }, end: { text: "31 de março", year } }, // Semana 13
    { start: { text: "1 de abril", year }, end: { text: "7 de abril", year } }, // Semana 14
    { start: { text: "8 de abril", year }, end: { text: "14 de abril", year } }, // Semana 15
    { start: { text: "15 de abril", year }, end: { text: "21 de abril", year } }, // Semana 16
    { start: { text: "22 de abril", year }, end: { text: "28 de abril", year } }, // Semana 17
    { start: { text: "29 de abril", year }, end: { text: "5 de maio", year } }, // Semana 18
    { start: { text: "6 de maio", year }, end: { text: "12 de maio", year } }, // Semana 19
    { start: { text: "13 de maio", year }, end: { text: "19 de maio", year } }, // Semana 20
    { start: { text: "20 de maio", year }, end: { text: "26 de maio", year } }, // Semana 21
    { start: { text: "27 de maio", year }, end: { text: "2 de junho", year } }, // Semana 22
    { start: { text: "3 de junho", year }, end: { text: "9 de junho", year } }, // Semana 23
    { start: { text: "10 de junho", year }, end: { text: "16 de junho", year } }, // Semana 24
    { start: { text: "17 de junho", year }, end: { text: "23 de junho", year } }, // Semana 25
    { start: { text: "24 de junho", year }, end: { text: "30 de junho", year } }, // Semana 26
    { start: { text: "1 de julho", year }, end: { text: "7 de julho", year } }, // Semana 27
    { start: { text: "8 de julho", year }, end: { text: "14 de julho", year } }, // Semana 28
    { start: { text: "15 de julho", year }, end: { text: "21 de julho", year } }, // Semana 29
    { start: { text: "22 de julho", year }, end: { text: "28 de julho", year } }, // Semana 30
    { start: { text: "29 de julho", year }, end: { text: "4 de agosto", year } }, // Semana 31
    { start: { text: "5 de agosto", year }, end: { text: "11 de agosto", year } }, // Semana 32
    { start: { text: "12 de agosto", year }, end: { text: "18 de agosto", year } }, // Semana 33
    { start: { text: "19 de agosto", year }, end: { text: "25 de agosto", year } }, // Semana 34
    { start: { text: "26 de agosto", year }, end: { text: "1 de setembro", year } }, // Semana 35
    { start: { text: "2 de setembro", year }, end: { text: "8 de setembro", year } }, // Semana 36
    { start: { text: "9 de setembro", year }, end: { text: "15 de setembro", year } }, // Semana 37
    { start: { text: "16 de setembro", year }, end: { text: "22 de setembro", year } }, // Semana 38
    { start: { text: "23 de setembro", year }, end: { text: "29 de setembro", year } }, // Semana 39
    { start: { text: "30 de setembro", year }, end: { text: "6 de outubro", year } }, // Semana 40
    { start: { text: "7 de outubro", year }, end: { text: "13 de outubro", year } }, // Semana 41
    { start: { text: "14 de outubro", year }, end: { text: "20 de outubro", year } }, // Semana 42
    { start: { text: "21 de outubro", year }, end: { text: "27 de outubro", year } }, // Semana 43
    { start: { text: "28 de outubro", year }, end: { text: "3 de novembro", year } }, // Semana 44
    { start: { text: "4 de novembro", year }, end: { text: "10 de novembro", year } }, // Semana 45
    { start: { text: "11 de novembro", year }, end: { text: "17 de novembro", year } }, // Semana 46
    { start: { text: "18 de novembro", year }, end: { text: "24 de novembro", year } }, // Semana 47
    { start: { text: "25 de novembro", year }, end: { text: "1 de dezembro", year } }, // Semana 48
    { start: { text: "2 de dezembro", year }, end: { text: "8 de dezembro", year } }, // Semana 49
    { start: { text: "9 de dezembro", year }, end: { text: "15 de dezembro", year } }, // Semana 50
    { start: { text: "16 de dezembro", year }, end: { text: "22 de dezembro", year } }, // Semana 51
    { start: { text: "23 de dezembro", year }, end: { text: "29 de dezembro", year } }, // Semana 52
    { start: { text: "30 de dezembro", year }, end: { text: "31 de dezembro", year } }  // Semana 53 (últimos dias do ano)
  ];
  
  return weekRanges.map(({ start, end }) => {
    return {
      startDate: parsePortugueseDate(start.text, start.year),
      endDate: parsePortugueseDate(end.text, end.year)
    };
  });
};

// Calculate week dates based on year and week number using the custom calendar
export const getWeekDates = (year: number, week: number) => {
  if (week < 1 || week > 53) {
    console.error(`Semana inválida: ${week}. Deve estar entre 1 e 53.`);
    // Return default dates for invalid week
    return {
      startDate: new Date(year, 0, 1),
      endDate: new Date(year, 0, 7)
    };
  }

  const weekRanges = getWeekRangesForYear(year);
  const weekIndex = week - 1; // Convert to 0-based index
  
  if (weekIndex >= weekRanges.length) {
    console.error(`Semana ${week} fora do intervalo para o ano ${year}`);
    return {
      startDate: new Date(year, 0, 1),
      endDate: new Date(year, 0, 7)
    };
  }
  
  return weekRanges[weekIndex];
};

// Check if an audit is overdue (programada and past its week)
export const isAuditOverdue = (audit: { status: string, week_number: number, year: number }) => {
  if (audit.status !== 'programada') return false;
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentWeek = getCurrentWeek();
  
  // If the audit is from a previous year
  if (audit.year < currentYear) return true;
  
  // If the audit is from current year but earlier week
  if (audit.year === currentYear && audit.week_number < currentWeek) return true;
  
  return false;
};

// Typed access to scheduled_audits table
export const getScheduledAuditsTable = () => {
  const client = supabase as SupabaseAny;
  return client.from('scheduled_audits');
};
