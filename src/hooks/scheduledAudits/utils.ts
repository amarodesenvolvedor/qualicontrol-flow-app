
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
  const target = new Date(year, 0, 1);
  const dayNum = target.getDay();
  const diff = week * 7;
  
  // Calculate first day of week
  if (dayNum <= 4) {
    target.setDate(target.getDate() - target.getDay() + 1 + diff);
  } else {
    target.setDate(target.getDate() + (7 - target.getDay()) + 1 + diff);
  }
  
  const startDate = new Date(target);
  const endDate = new Date(target);
  endDate.setDate(endDate.getDate() + 6);
  
  return { startDate, endDate };
};

// Typed access to scheduled_audits table
export const getScheduledAuditsTable = () => {
  const client = supabase as SupabaseAny;
  return client.from('scheduled_audits');
};
