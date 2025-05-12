
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  control: Control<NonConformanceFormValues>;
  name: keyof NonConformanceFormValues;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
}

const SelectField = ({ 
  control, 
  name, 
  label, 
  options,
  placeholder = "Selecione uma opção", 
  required = false 
}: SelectFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Ensure field.value is a string for the Select component
        const value = typeof field.value === 'string' ? field.value : '';
        
        return (
          <FormItem>
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <Select onValueChange={field.onChange} value={value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default SelectField;
