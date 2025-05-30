
import type { Department } from '@/hooks/useDepartments';

export type NonConformance = {
  id: string;
  code: string | null;
  title: string;
  description: string | null;
  location: string | null;
  department_id: string;
  immediate_actions: string | null;
  responsible_name: string;
  auditor_name: string;
  occurrence_date: string;
  response_date: string | null;
  action_verification_date: string | null;
  effectiveness_verification_date: string | null;
  completion_date: string | null;
  created_at: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  department?: Department;
  created_by?: string | null;
  updated_at?: string;
  root_cause_analysis?: string | null;
  corrective_action?: string | null;
  iso_requirement?: string | null;
};

export type NonConformanceCreateData = Omit<NonConformance, 'id' | 'created_at' | 'department' | 'created_by' | 'updated_at'>;

export type NonConformanceUpdateData = Partial<NonConformanceCreateData>;

export type NonConformanceFilter = {
  status?: string;
  departmentId?: string;
  responsibleName?: string;
  dateRange?: { from: Date | null; to: Date | null } | null;
  searchTerm?: string;
  isoRequirement?: string;
};
