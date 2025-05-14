
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileDown } from "lucide-react";

interface EditFormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  onGenerateAcac?: () => void;
}

const EditFormActions = ({ onCancel, isSubmitting = false, onGenerateAcac }: EditFormActionsProps) => {
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
      
      {onGenerateAcac && (
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onGenerateAcac}
          disabled={isSubmitting}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Gerar ACAC
        </Button>
      )}
      
      <Button type="submit" disabled={isSubmitting}>
        <Save className="h-4 w-4 mr-2" />
        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </div>
  );
};

export default EditFormActions;
