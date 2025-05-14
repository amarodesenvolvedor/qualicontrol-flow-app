
import { FormActions as SharedFormActions } from "@/components/shared/FormActions";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditFormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  onGenerateAcac?: () => void;
}

const EditFormActions = ({ 
  onCancel, 
  isSubmitting = false, 
  onGenerateAcac 
}: EditFormActionsProps) => {
  const renderExtraButtons = onGenerateAcac ? () => (
    <Button 
      type="button" 
      variant="secondary" 
      onClick={onGenerateAcac}
      disabled={isSubmitting}
    >
      <FileDown className="h-4 w-4 mr-2" />
      Gerar ACAC
    </Button>
  ) : undefined;

  return (
    <SharedFormActions
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      submitLabel="Salvar Alterações"
      cancelLabel="Cancelar"
      renderExtraButtons={renderExtraButtons}
    />
  );
};

export default EditFormActions;
