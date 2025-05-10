
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
}

export interface AuditReportInput {
  title: string;
  description?: string | null;
  department_id: string;
  audit_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  file_name: string;
  file_size: number;
  file_type: string;
  file_path?: string;
}

export type AuditFilter = {
  year?: string;
  departmentId?: string;
  searchTerm?: string;
};
