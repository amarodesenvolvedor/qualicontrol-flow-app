
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface FormActionsProps {
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  submittingLabel?: string;
  cancelLabel?: string;
  showCancelButton?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
  renderExtraButtons?: () => React.ReactNode;
}

export const FormActions = ({
  isSubmitting = false,
  onCancel,
  submitLabel = "Salvar",
  submittingLabel = "Salvando...",
  cancelLabel = "Cancelar",
  showCancelButton = true,
  variant = "primary",
  className = "flex justify-end space-x-2",
  renderExtraButtons,
}: FormActionsProps) => {
  return (
    <div className={className}>
      {showCancelButton && onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      )}
      
      {renderExtraButtons && renderExtraButtons()}
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            {submittingLabel === "Salvando..." && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {submittingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
};
