import { z } from "zod";

export const nonConformanceFormSchema = z.object({
  code: z.string().optional(),
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres.",
  }),
  description: z.string().optional(),
  location: z.string().optional(),
  department_id: z.string().min(1, {
    message: "Por favor, selecione um departamento.",
  }),
  immediate_actions: z.string().optional(),
  responsible_name: z.string().min(3, {
    message: "O nome do responsável deve ter pelo menos 3 caracteres.",
  }),
  auditor_name: z.string().min(3, {
    message: "O nome do auditor deve ter pelo menos 3 caracteres.",
  }),
  occurrence_date: z.date(),
  response_date: z.date().optional(),
  action_verification_date: z.date().optional(),
  effectiveness_verification_date: z.date().optional(),
  completion_date: z.date().optional(),
  status: z.enum(['pending', 'in-progress', 'resolved', 'closed']),
  root_cause_analysis: z.string().optional(),
  corrective_action: z.string().optional(),
});

export type NonConformanceFormValues = z.infer<typeof nonConformanceFormSchema>;
