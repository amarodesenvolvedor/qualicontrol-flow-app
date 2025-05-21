
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import { ISO_REQUIREMENTS, ISO_REQUIREMENT_GROUPS } from "@/utils/isoRequirements";

interface ISORequirementFieldProps {
  control: Control<NonConformanceFormValues>;
}

const ISORequirementField = ({ control }: ISORequirementFieldProps) => {
  return (
    <FormField
      control={control}
      name="iso_requirement"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Requisito ISO 9001:2015 <span className="text-red-500">*</span>
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger className="w-full">
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
      )}
    />
  );
};

export default ISORequirementField;
