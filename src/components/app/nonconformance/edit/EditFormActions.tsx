
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

interface EditFormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

const EditFormActions = ({ onCancel, isSubmitting = false }: EditFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        <Save className="h-4 w-4 mr-2" />
        Salvar Alterações
      </Button>
    </div>
  );
};

export default EditFormActions;
