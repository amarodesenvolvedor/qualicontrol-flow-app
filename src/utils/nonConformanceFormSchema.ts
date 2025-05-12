
import { z } from "zod";

export const nonConformanceFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  location: z.string().min(3, "O local deve ter pelo menos 3 caracteres"),
  department_id: z.string().min(1, "Selecione um departamento"),
  category: z.string().min(1, "Selecione uma categoria"),
  immediate_actions: z.string().optional(),
  responsible_name: z.string().min(3, "O nome do responsável deve ter pelo menos 3 caracteres"),
  auditor_name: z.string().min(3, "O nome do auditor deve ter pelo menos 3 caracteres"),
  occurrence_date: z.date({
    required_error: "A data de ocorrência é obrigatória",
  }),
  deadline_date: z.date().optional(),
  effectiveness_verification_date: z.date().optional(),
  completion_date: z.date().optional(),
  status: z.enum(['pending', 'in-progress', 'resolved', 'closed'], {
    required_error: "Selecione um status",
  }),
});

export type NonConformanceFormValues = z.infer<typeof nonConformanceFormSchema>;
