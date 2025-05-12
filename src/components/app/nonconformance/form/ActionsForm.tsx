
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Control } from "react-hook-form";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import TextField from "../edit/TextField";
import DateField from "../edit/DateField";
import FormFieldGroup from "../edit/FormFieldGroup";

interface ActionsFormProps {
  control: Control<NonConformanceFormValues>;
}

const ActionsForm = ({ control }: ActionsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações e Responsabilidades</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TextField 
          control={control} 
          name="responsible_name" 
          label="Responsável pela Ação" 
          placeholder="Nome da pessoa responsável"
          required
        />
        
        <TextField 
          control={control} 
          name="immediate_actions" 
          label="Ações Imediatas Tomadas" 
          placeholder="Descreva as ações imediatas (se houver)"
          multiline
          rows={4}
        />

        <FormFieldGroup>
          <DateField 
            control={control}
            name="deadline_date"
            label="Data Limite"
            placeholder="Selecione uma data (opcional)"
          />
          
          <DateField 
            control={control}
            name="effectiveness_verification_date"
            label="Data de Verificação da Eficácia" 
            placeholder="Selecione uma data (opcional)"
          />
        </FormFieldGroup>

        <DateField 
          control={control}
          name="completion_date"
          label="Data de Conclusão" 
          placeholder="Selecione uma data (opcional)"
        />
      </CardContent>
    </Card>
  );
};

export default ActionsForm;
