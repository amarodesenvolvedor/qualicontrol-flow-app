import { useDepartments } from "@/hooks/useDepartments";
import { Form } from "@/components/ui/form";
import FormFieldGroup from "./FormFieldGroup";
import TextField from "./TextField";
import SelectField from "./SelectField";
import DateField from "./DateField";
import EditFormActions from "./EditFormActions";
import { useNonConformanceEdit } from "@/hooks/useNonConformanceEdit";

const EditForm = () => {
  const { form, onSubmit, handleCancel, isSubmitting, generateAcac } = useNonConformanceEdit();
  const { departments } = useDepartments();
  
  const categories = [
    { value: "quality", label: "Qualidade" },
    { value: "safety", label: "Segurança" },
    { value: "environment", label: "Meio Ambiente" },
    { value: "maintenance", label: "Manutenção" },
    { value: "operation", label: "Operação" }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'in-progress', label: 'Em Andamento' },
    { value: 'resolved', label: 'Resolvido' },
    { value: 'closed', label: 'Encerrado' }
  ];

  const departmentOptions = departments.map(dept => ({
    value: dept.id,
    label: dept.name
  }));

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormFieldGroup>
          <TextField 
            control={form.control} 
            name="code" 
            label="Código" 
            required
          />
          <TextField 
            control={form.control} 
            name="title" 
            label="Título" 
            required
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <TextField 
            control={form.control} 
            name="location" 
            label="Local" 
            required
          />
          <SelectField 
            control={form.control} 
            name="department_id" 
            label="Departamento" 
            options={departmentOptions}
            required
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <SelectField 
            control={form.control} 
            name="category" 
            label="Categoria" 
            options={categories}
            required
          />
          <SelectField 
            control={form.control} 
            name="status" 
            label="Status" 
            options={statusOptions}
            required
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <DateField 
            control={form.control} 
            name="occurrence_date" 
            label="Data de Ocorrência" 
            required
          />
          <DateField 
            control={form.control} 
            name="deadline_date" 
            label="Data Limite"
            placeholder="Selecione uma data (opcional)"
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <DateField 
            control={form.control}
            name="effectiveness_verification_date"
            label="Data de Verificação da Eficácia" 
            placeholder="Selecione uma data (opcional)"
          />
          <DateField 
            control={form.control}
            name="completion_date"
            label="Data de Conclusão" 
            placeholder="Selecione uma data (opcional)"
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <TextField 
            control={form.control} 
            name="responsible_name" 
            label="Responsável pela Ação" 
            required
          />
          <TextField 
            control={form.control} 
            name="auditor_name" 
            label="Auditor" 
            required
          />
        </FormFieldGroup>

        <TextField 
          control={form.control} 
          name="description" 
          label="Descrição" 
          multiline
          rows={4}
          required
        />

        <TextField 
          control={form.control} 
          name="immediate_actions" 
          label="Ações Imediatas Tomadas" 
          multiline
          rows={4}
        />

        <EditFormActions 
          onCancel={handleCancel} 
          isSubmitting={isSubmitting}
          onGenerateAcac={generateAcac} 
        />
      </form>
    </Form>
  );
};

export default EditForm;
