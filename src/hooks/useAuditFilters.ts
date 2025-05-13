
import { useState } from 'react';
import { AuditFilter } from '@/types/audit';

export const useAuditFilters = () => {
  const [filters, setFilters] = useState<AuditFilter>({});

  // Função para obter anos dos relatórios de auditoria
  const getYearsFromReports = (reports: any[]): string[] => {
    const years = new Set<string>();
    
    reports.forEach(report => {
      const year = new Date(report.audit_date).getFullYear().toString();
      years.add(year);
    });

    return Array.from(years).sort().reverse();
  };

  // Função para obter departamentos dos relatórios
  const getDepartmentsFromReports = (reports: any[]): Set<string> => {
    const departmentIds = new Set<string>();
    
    reports.forEach(report => {
      if (report.department && report.department.id) {
        departmentIds.add(report.department.id);
      }
    });

    return departmentIds;
  };

  // Função para filtrar relatórios por ano
  const filterReportsByYear = (reports: any[], year?: string): any[] => {
    if (!year) return reports;
    
    return reports.filter(report => {
      const reportYear = new Date(report.audit_date).getFullYear().toString();
      return reportYear === year;
    });
  };

  // Função para filtrar relatórios por departamentos
  const filterReportsByDepartments = (reports: any[], departmentIds?: string): any[] => {
    if (!departmentIds) return reports;
    
    const deptIdArray = departmentIds.split(',');
    return reports.filter(report => 
      report.department && deptIdArray.includes(report.department.id)
    );
  };

  return {
    filters,
    setFilters,
    getYearsFromReports,
    getDepartmentsFromReports,
    filterReportsByYear,
    filterReportsByDepartments
  };
};
