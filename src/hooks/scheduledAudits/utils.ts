
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
  // Define week ranges exactly as provided by the user - all weeks start on Monday and end on Sunday
  const weekRanges = [
    { start: "30 de dezembro", end: "5 de janeiro" }, // Semana 1
    { start: "6 de janeiro", end: "12 de janeiro" }, // Semana 2
    { start: "13 de janeiro", end: "19 de janeiro" }, // Semana 3
    { start: "20 de janeiro", end: "26 de janeiro" }, // Semana 4
    { start: "27 de janeiro", end: "2 de fevereiro" }, // Semana 5
    { start: "3 de fevereiro", end: "9 de fevereiro" }, // Semana 6
    { start: "10 de fevereiro", end: "16 de fevereiro" }, // Semana 7
    { start: "17 de fevereiro", end: "23 de fevereiro" }, // Semana 8
    { start: "24 de fevereiro", end: "2 de março" }, // Semana 9
    { start: "3 de março", end: "9 de março" }, // Semana 10
    { start: "10 de março", end: "16 de março" }, // Semana 11
    { start: "17 de março", end: "23 de março" }, // Semana 12
    { start: "24 de março", end: "30 de março" }, // Semana 13
    { start: "31 de março", end: "6 de abril" }, // Semana 14
    { start: "7 de abril", end: "13 de abril" }, // Semana 15
    { start: "14 de abril", end: "20 de abril" }, // Semana 16
    { start: "21 de abril", end: "27 de abril" }, // Semana 17
    { start: "28 de abril", end: "4 de maio" }, // Semana 18
    { start: "5 de maio", end: "11 de maio" }, // Semana 19
    { start: "12 de maio", end: "18 de maio" }, // Semana 20
    { start: "19 de maio", end: "25 de maio" }, // Semana 21
    { start: "26 de maio", end: "1 de junho" }, // Semana 22
    { start: "2 de junho", end: "8 de junho" }, // Semana 23
    { start: "9 de junho", end: "15 de junho" }, // Semana 24
    { start: "16 de junho", end: "22 de junho" }, // Semana 25
    { start: "23 de junho", end: "29 de junho" }, // Semana 26
    { start: "30 de junho", end: "6 de julho" }, // Semana 27
    { start: "7 de julho", end: "13 de julho" }, // Semana 28
    { start: "14 de julho", end: "20 de julho" }, // Semana 29
    { start: "21 de julho", end: "27 de julho" }, // Semana 30
    { start: "28 de julho", end: "3 de agosto" }, // Semana 31
    { start: "4 de agosto", end: "10 de agosto" }, // Semana 32
    { start: "11 de agosto", end: "17 de agosto" }, // Semana 33
    { start: "18 de agosto", end: "24 de agosto" }, // Semana 34
    { start: "25 de agosto", end: "31 de agosto" }, // Semana 35
    { start: "1 de setembro", end: "7 de setembro" }, // Semana 36
    { start: "8 de setembro", end: "14 de setembro" }, // Semana 37
    { start: "15 de setembro", end: "21 de setembro" }, // Semana 38
    { start: "22 de setembro", end: "28 de setembro" }, // Semana 39
    { start: "29 de setembro", end: "5 de outubro" }, // Semana 40
    { start: "6 de outubro", end: "12 de outubro" }, // Semana 41
    { start: "13 de outubro", end: "19 de outubro" }, // Semana 42
    { start: "20 de outubro", end: "26 de outubro" }, // Semana 43
    { start: "27 de outubro", end: "2 de novembro" }, // Semana 44
    { start: "3 de novembro", end: "9 de novembro" }, // Semana 45
    { start: "10 de novembro", end: "16 de novembro" }, // Semana 46
    { start: "17 de novembro", end: "23 de novembro" }, // Semana 47
    { start: "24 de novembro", end: "30 de novembro" }, // Semana 48
    { start: "1 de dezembro", end: "7 de dezembro" }, // Semana 49
    { start: "8 de dezembro", end: "14 de dezembro" }, // Semana 50
    { start: "15 de dezembro", end: "21 de dezembro" }, // Semana 51
    { start: "22 de dezembro", end: "28 de dezembro" }  // Semana 52
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
