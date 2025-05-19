
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export interface FormActionsProps {
  submitText?: string;
  cancelText?: string;
  onSubmitClick: () => void;
  onCancelClick: () => void;
  isSubmitting: boolean;
}

export function FormActions({
  submitText = "Salvar",
  cancelText = "Cancelar",
  onSubmitClick,
  onCancelClick,
  isSubmitting
}: FormActionsProps) {
  return (
    <CardFooter className="flex justify-end space-x-2 border-t bg-muted/50 p-6">
      <Button variant="outline" onClick={onCancelClick} disabled={isSubmitting}>
        {cancelText}
      </Button>
      <Button onClick={onSubmitClick} disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitText}
      </Button>
    </CardFooter>
  );
}
