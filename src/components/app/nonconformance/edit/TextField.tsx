
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";

interface TextFieldProps {
  control: Control<NonConformanceFormValues>;
  name: keyof NonConformanceFormValues;
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

const TextField = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  required = false,
  multiline = false,
  rows = 4
}: TextFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            {multiline ? (
              <Textarea rows={rows} placeholder={placeholder} {...field} />
            ) : (
              <Input placeholder={placeholder} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextField;
