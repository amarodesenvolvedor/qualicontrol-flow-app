
import { useState } from 'react';
import { AuditFilter } from '@/types/audit';

export const useAuditFilters = () => {
  const [filters, setFilters] = useState<AuditFilter>({});

  // Function to get years from audit reports
  const getYearsFromReports = (reports: any[]): string[] => {
    const years = new Set<string>();
    
    reports.forEach(report => {
      const year = new Date(report.audit_date).getFullYear().toString();
      years.add(year);
    });

    return Array.from(years).sort().reverse();
  };

  return {
    filters,
    setFilters,
    getYearsFromReports,
  };
};
