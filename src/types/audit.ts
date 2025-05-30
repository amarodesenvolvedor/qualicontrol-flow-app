
export interface AuditReport {
  id: string;
  title: string;
  description: string | null;
  department_id: string;
  department?: {
    id: string;
    name: string;
  };
  audit_date: string;
  created_at: string;
  status: 'pending' | 'in_progress' | 'completed';
  file_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
  created_by: string | null;
  responsible_auditor: string | null;
}

export interface AuditReportInput {
  title: string;
  description?: string | null;
  department_id: string;
  audit_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  file_path?: string;
  file_name: string;
  file_size: number;
  file_type: string;
  responsible_auditor: string;
}

export type AuditFilter = {
  year?: string;
  departmentId?: string;
  status?: string;
  searchTerm?: string;
  dateRange?: { from: Date | null; to: Date | null } | null;
};

// Tipo para auditoria programada vinda do banco de dados
export interface ScheduledAudit {
  id: string;
  department_id: string;
  responsible_auditor: string;
  week_number: number;
  year: number;
  status: "programada" | "agendada" | "concluida" | "atrasada";
  notes?: string;
  created_at: string;
  updated_at: string;
  department?: {
    id: string;
    name: string;
  };
}

// Tipo para input de criação/atualização de auditoria programada
export interface ScheduledAuditInput {
  department_id: string;
  responsible_auditor: string;
  week_number: number;
  year: number;
  status: "programada" | "agendada" | "concluida" | "atrasada";
  notes?: string;
}
