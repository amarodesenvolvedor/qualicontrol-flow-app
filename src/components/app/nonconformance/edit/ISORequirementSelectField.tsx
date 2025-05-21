
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import { ISO_REQUIREMENTS, ISO_REQUIREMENT_GROUPS } from "@/utils/isoRequirements";

interface ISORequirementSelectFieldProps {
  control: Control<NonConformanceFormValues>;
  required?: boolean;
}

const ISORequirementSelectField = ({ control, required = true }: ISORequirementSelectFieldProps) => {
  return (
    <FormField
      control={control}
      name="iso_requirement"
      render={({ field }) => {
        // Ensure field.value is a string for the Select component
        const value = typeof field.value === 'string' ? field.value : '';
        
        return (
          <FormItem>
            <FormLabel>
              Requisito ISO 9001:2015 {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <Select onValueChange={field.onChange} value={value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um requisito" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-96">
                {ISO_REQUIREMENT_GROUPS.map((group, groupIndex) => (
                  <SelectGroup key={groupIndex}>
                    <SelectLabel className="font-bold text-primary">{group.title}</SelectLabel>
                    {ISO_REQUIREMENTS.slice(group.start, group.end).map((requirement) => (
                      <SelectItem key={requirement.value} value={requirement.value}>
                        {requirement.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
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

export default ISORequirementSelectField;
