
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";

interface CodeFieldProps {
  control: Control<NonConformanceFormValues>;
}

const CodeField = ({ control }: CodeFieldProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Código da Não Conformidade</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Insira o código da não conformidade (ex: NC-2025-001)" 
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default CodeField;
