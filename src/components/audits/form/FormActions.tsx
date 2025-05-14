
import { FormActions as SharedFormActions } from "@/components/shared/FormActions";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function FormActions({ isSubmitting, onCancel }: FormActionsProps) {
  return (
    <SharedFormActions
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      submitLabel="Salvar relatório"
      submittingLabel="Salvando..."
      showCancelButton={!!onCancel}
    />
  );
}
