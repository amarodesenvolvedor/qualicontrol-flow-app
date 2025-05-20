
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
  // Replace month names with numbers for easier parsing
  let processedStr = dateStr.trim();
  const months: { [key: string]: string } = {
    'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
    'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
    'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
  };
  
  // Extract day and month
  let day = processedStr.split(' ')[0];
  if (day.length === 1) day = '0' + day;
  
  let month = '';
  for (const [monthName, monthNum] of Object.entries(months)) {
    if (processedStr.includes(monthName)) {
      month = monthNum;
      break;
    }
  }
  
  // If the date contains a year, use it, otherwise use the provided year
  let dateYear = year;
  if (processedStr.includes('2024')) {
    dateYear = 2024;
  } else if (processedStr.includes('2025')) {
    dateYear = 2025;
  }
  
  // Format the date as a string in a format that Date can parse
  const formattedDate = `${dateYear}-${month}-${day}`;
  return new Date(formattedDate);
};

// Get week ranges for a specific year
const getWeekRangesForYear = (year: number) => {
  // Define week ranges exactly as provided in the calendar
  // This is a fixed calendar structure provided by the user
  const weekRanges = [
    { start: "30 de dezembro", end: "5 de janeiro" },
    { start: "6 de janeiro", end: "12 de janeiro" },
    { start: "13 de janeiro", end: "19 de janeiro" },
    { start: "20 de janeiro", end: "26 de janeiro" },
    { start: "27 de janeiro", end: "2 de fevereiro" },
    { start: "3 de fevereiro", end: "9 de fevereiro" },
    { start: "10 de fevereiro", end: "16 de fevereiro" },
    { start: "17 de fevereiro", end: "23 de fevereiro" },
    { start: "24 de fevereiro", end: "2 de março" },
    { start: "3 de março", end: "9 de março" },
    { start: "10 de março", end: "16 de março" },
    { start: "17 de março", end: "23 de março" },
    { start: "24 de março", end: "30 de março" },
    { start: "31 de março", end: "6 de abril" },
    { start: "7 de abril", end: "13 de abril" },
    { start: "14 de abril", end: "20 de abril" },
    { start: "21 de abril", end: "27 de abril" },
    { start: "28 de abril", end: "4 de maio" },
    { start: "5 de maio", end: "11 de maio" },
    { start: "12 de maio", end: "18 de maio" },
    { start: "19 de maio", end: "25 de maio" },
    { start: "26 de maio", end: "1 de junho" },
    { start: "2 de junho", end: "8 de junho" },
    { start: "9 de junho", end: "15 de junho" },
    { start: "16 de junho", end: "22 de junho" },
    { start: "23 de junho", end: "29 de junho" },
    { start: "30 de junho", end: "6 de julho" },
    { start: "7 de julho", end: "13 de julho" },
    { start: "14 de julho", end: "20 de julho" },
    { start: "21 de julho", end: "27 de julho" },
    { start: "28 de julho", end: "3 de agosto" },
    { start: "4 de agosto", end: "10 de agosto" },
    { start: "11 de agosto", end: "17 de agosto" },
    { start: "18 de agosto", end: "24 de agosto" },
    { start: "25 de agosto", end: "31 de agosto" },
    { start: "1 de setembro", end: "7 de setembro" },
    { start: "8 de setembro", end: "14 de setembro" },
    { start: "15 de setembro", end: "21 de setembro" },
    { start: "22 de setembro", end: "28 de setembro" },
    { start: "29 de setembro", end: "5 de outubro" },
    { start: "6 de outubro", end: "12 de outubro" },
    { start: "13 de outubro", end: "19 de outubro" },
    { start: "20 de outubro", end: "26 de outubro" },
    { start: "27 de outubro", end: "2 de novembro" },
    { start: "3 de novembro", end: "9 de novembro" },
    { start: "10 de novembro", end: "16 de novembro" },
    { start: "17 de novembro", end: "23 de novembro" },
    { start: "24 de novembro", end: "30 de novembro" },
    { start: "1 de dezembro", end: "7 de dezembro" },
    { start: "8 de dezembro", end: "14 de dezembro" },
    { start: "15 de dezembro", end: "21 de dezembro" },
    { start: "22 de dezembro", end: "28 de dezembro" }
  ];
  
  return weekRanges.map(({ start, end }) => {
    // First week of the year might start in previous year
    const startYear = start.includes("dezembro") && weekRanges.indexOf({ start, end }) === 0 ? year - 1 : year;
    return {
      startDate: parsePortugueseDate(start, startYear),
      endDate: parsePortugueseDate(end, year)
    };
  });
};

// Calculate week dates based on year and week number using the custom calendar
export const getWeekDates = (year: number, week: number) => {
  if (week < 1 || week > 52) {
    console.error(`Semana inválida: ${week}. Deve estar entre 1 e 52.`);
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
