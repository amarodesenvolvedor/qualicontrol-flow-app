
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Control } from "react-hook-form";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import TextField from "../edit/TextField";
import DateField from "../edit/DateField";
import FormFieldGroup from "../edit/FormFieldGroup";

interface BasicInfoFormProps {
  control: Control<NonConformanceFormValues>;
}

const BasicInfoForm = ({ control }: BasicInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <TextField 
            control={control} 
            name="title" 
            label="Título" 
            placeholder="Título resumido da não conformidade"
            required
          />
          
          <TextField 
            control={control} 
            name="description" 
            label="Descrição Detalhada" 
            placeholder="Descreva detalhadamente o ocorrido"
            multiline
            rows={4}
            required
          />

          <FormFieldGroup>
            <TextField 
              control={control} 
              name="location" 
              label="Local da Ocorrência" 
              placeholder="Setor, linha ou local específico"
              required
            />
            
            <DateField 
              control={control}
              name="occurrence_date"
              label="Data da Ocorrência" 
              required
            />
          </FormFieldGroup>

          <TextField 
            control={control} 
            name="auditor_name" 
            label="Nome do Auditor" 
            placeholder="Nome completo do auditor"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;
