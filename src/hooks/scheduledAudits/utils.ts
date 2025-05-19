
import { SupabaseAny } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

// Gets current ISO week number
export const getCurrentWeek = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  const week = Math.ceil((day + start.getDay()) / 7);
  return week;
};

// Gets current year
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Calculate week dates based on year and week number
export const getWeekDates = (year: number, week: number) => {
  // Create date object for January 1st of the given year
  const januaryFirst = new Date(year, 0, 1);
  
  // Calculate the first day of the week (Sunday is 0)
  // We want week 1 to start from first day of the year
  // Adjust depending on which day of the week January 1st falls on
  const daysOffset = januaryFirst.getDay(); // 0 (Sunday) to 6 (Saturday)
  
  // Calculate the date of the first day of the requested week
  // (week - 1) because we want week 1 to be the first week of the year
  const firstDayOfWeek = new Date(year, 0, 1 + (week - 1) * 7 - daysOffset);
  
  // If the first day is not a Monday, adjust to the previous Monday
  if (firstDayOfWeek.getDay() !== 1) { // 1 is Monday
    // Get to the Monday of this week
    const daysToSubtract = firstDayOfWeek.getDay() === 0 ? 6 : firstDayOfWeek.getDay() - 1;
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - daysToSubtract);
  }
  
  // Calculate the end date (Sunday)
  const endDate = new Date(firstDayOfWeek);
  endDate.setDate(endDate.getDate() + 6); // Add 6 days to get to Sunday
  
  return { startDate: firstDayOfWeek, endDate };
};

// Check if an audit is overdue (programada and past its week)
export const isAuditOverdue = (audit: { status: string, week_number: number, year: number }) => {
  if (audit.status !== 'programada') return false;
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentWeek = getCurrentWeek();
  
  // If the audit is from a previous year or from an earlier week in the current year
  return (audit.year < currentYear) || 
         (audit.year === currentYear && audit.week_number < currentWeek);
};

// Typed access to scheduled_audits table
export const getScheduledAuditsTable = () => {
  const client = supabase as SupabaseAny;
  return client.from('scheduled_audits');
};
