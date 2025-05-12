
import { ReactNode } from "react";

interface FormFieldGroupProps {
  children: ReactNode;
  gridCols?: number;
  className?: string;
}

const FormFieldGroup = ({ 
  children, 
  gridCols = 2,
  className = "" 
}: FormFieldGroupProps) => {
  const gridClass = gridCols === 1 
    ? "grid grid-cols-1 gap-6" 
    : `grid grid-cols-1 md:grid-cols-${gridCols} gap-6`;
  
  return (
    <div className={`${gridClass} ${className}`}>
      {children}
    </div>
  );
};

export default FormFieldGroup;
