
import { FormActions as SharedFormActions } from "@/components/shared/FormActions";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const FormActions = ({ isSubmitting, onCancel }: FormActionsProps) => {
  return (
    <SharedFormActions
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      submitLabel="Registrar Não Conformidade"
      submittingLabel="Enviando..."
    />
  );
};

export default FormActions;
