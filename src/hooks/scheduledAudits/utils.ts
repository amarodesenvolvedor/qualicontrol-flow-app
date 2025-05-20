
import { startOfWeek, addDays, addWeeks, format, getISOWeek, getYear, startOfYear, isBefore, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { ScheduledAudit } from "@/types/audit";

/**
 * Returns start and end dates for a given week number and year
 */
export function getWeekDates(weekNumber: number, year: number) {
  // Validate week number (ISO weeks are 1-53)
  if (typeof weekNumber !== 'number' || weekNumber < 1 || weekNumber > 53) {
    throw new Error(`Semana inválida: ${weekNumber}. Deve estar entre 1 e 53.`);
  }
  
  // Validate year
  if (typeof year !== 'number' || year < 2000 || year > 2100) {
    throw new Error(`Ano inválido: ${year}. Deve estar entre 2000 e 2100.`);
  }

  try {
    // Create a date representing the first day of the year
    const firstDayOfYear = new Date(year, 0, 1);
    
    // Find the first day of the first week of the year
    const firstWeekStart = startOfWeek(firstDayOfYear, { locale: ptBR, weekStartsOn: 0 });
    
    // Add the specified number of weeks
    const targetWeekStart = addWeeks(firstWeekStart, weekNumber - 1);
    
    // Calculate the end of the week (6 days later)
    const targetWeekEnd = addDays(targetWeekStart, 6);
    
    return {
      startDate: targetWeekStart,
      endDate: targetWeekEnd
    };
  } catch (error) {
    console.error(`Erro ao calcular datas da semana: ${error.message}`, 
                   { weekNumber, year });
    
    // Return current week as fallback
    const now = new Date();
    const currentWeekStart = startOfWeek(now, { locale: ptBR, weekStartsOn: 0 });
    return {
      startDate: currentWeekStart,
      endDate: addDays(currentWeekStart, 6)
    };
  }
}

/**
 * Gets the current week number
 */
export function getCurrentWeek(): number {
  return getISOWeek(new Date());
}

/**
 * Gets the current year
 */
export function getCurrentYear(): number {
  return getYear(new Date());
}

/**
 * Check if an audit is overdue
 */
export function isAuditOverdue(audit: ScheduledAudit): boolean {
  if (audit.status !== 'programada') {
    return false;
  }
  
  const today = new Date();
  const currentWeek = getCurrentWeek();
  const currentYear = getCurrentYear();
  
  // Check if current year is greater
  if (audit.year < currentYear) {
    return true;
  }
  
  // Check if current year is the same but week is past
  if (audit.year === currentYear && audit.week_number < currentWeek) {
    return true;
  }
  
  return false;
}

/**
 * Fetches scheduled audits from Supabase and applies necessary transformations.
 */
export const getScheduledAudits = async () => {
  try {
    const { data, error } = await getScheduledAuditsTable().select('*');

    if (error) {
      console.error("Erro ao buscar auditorias programadas:", error);
      throw new Error(error.message);
    }

    return data as ScheduledAudit[];
  } catch (error: any) {
    console.error("Erro ao buscar auditorias programadas:", error);
    throw new Error(`Erro ao buscar auditorias: ${error.message}`);
  }
};

/**
 * Retrieves the Supabase table for scheduled audits.
 */
export const getScheduledAuditsTable = () => {
  return supabase.from('scheduled_audits');
};
