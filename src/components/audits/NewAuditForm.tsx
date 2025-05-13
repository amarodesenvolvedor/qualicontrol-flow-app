
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import { format } from 'date-fns';
import type { Department } from '@/hooks/useDepartments';
import type { AuditReportInput } from '@/types/audit';
import { FormHeader } from './form/FormHeader';
import { BasicInfoFields } from './form/BasicInfoFields';
import { DateStatusFields } from './form/DateStatusFields';
import { FileUploadField } from './form/FileUploadField';
import { FormActions } from './form/FormActions';

// Form validation schema
const formSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  department_id: z.string().min(1, 'Selecione um departamento'),
  description: z.string().optional(),
  audit_date: z.date({
    required_error: 'A data da auditoria é obrigatória',
  }),
  status: z.enum(['pending', 'in_progress', 'completed']),
  responsible_auditor: z.string().min(3, 'O nome do auditor deve ter pelo menos 3 caracteres'),
});

interface NewAuditFormProps {
  departments: Department[];
  onSubmit: (data: { data: AuditReportInput, file: File }) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function NewAuditForm({ 
  departments, 
  onSubmit, 
  isSubmitting,
  onCancel
}: NewAuditFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      responsible_auditor: '',
    },
  });

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setFileError(file ? null : 'É necessário anexar um arquivo PDF');
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!selectedFile) {
      setFileError('É necessário anexar um arquivo PDF');
      return;
    }

    const data: AuditReportInput = {
      title: values.title,
      description: values.description || null,
      department_id: values.department_id,
      audit_date: format(values.audit_date, 'yyyy-MM-dd'),
      status: values.status,
      responsible_auditor: values.responsible_auditor,
      file_name: selectedFile.name,
      file_size: selectedFile.size,
      file_type: selectedFile.type,
    };

    onSubmit({ data, file: selectedFile });
  };

  return (
    <div className="px-4 py-6 sm:p-6 bg-card border rounded-lg shadow-sm">
      <FormHeader />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <BasicInfoFields departments={departments} />
          <DateStatusFields />
          <FileUploadField 
            onFileChange={handleFileChange} 
            error={fileError} 
            selectedFile={selectedFile} 
          />
          <FormActions isSubmitting={isSubmitting} onCancel={onCancel} />
        </form>
      </Form>
    </div>
  );
}
