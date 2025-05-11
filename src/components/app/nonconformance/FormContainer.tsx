
import { useNonConformanceForm } from "@/hooks/useNonConformanceForm";
import BasicInfoCard from "./BasicInfoCard";
import CategoryCard from "./CategoryCard";
import ActionsCard from "./ActionsCard";
import EvidenceCard from "./EvidenceCard";
import FormActions from "./FormActions";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const FormContainer = () => {
  const {
    formData,
    selectedDate,
    deadlineDate,
    files,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    removeFile,
    handleDepartmentChange,
    handleCategoryChange,
    handleStatusChange,
    setSelectedDate,
    setDeadlineDate,
    handleSubmit,
    handleCancel
  } = useNonConformanceForm();

  // Add this form instance to provide the FormProvider context
  const form = useForm();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="space-y-6">
          {/* Informações Básicas */}
          <BasicInfoCard
            title={formData.title}
            description={formData.description}
            location={formData.location}
            auditorName={formData.auditor_name}
            selectedDate={selectedDate}
            onInputChange={handleInputChange}
            onDateChange={setSelectedDate}
          />

          {/* Categorização */}
          <CategoryCard
            department={formData.department_id}
            category={formData.category}
            status={formData.status}
            onDepartmentChange={handleDepartmentChange}
            onCategoryChange={handleCategoryChange}
            onStatusChange={handleStatusChange}
          />

          {/* Ações e Responsabilidades */}
          <ActionsCard
            immediateActions={formData.immediate_actions}
            responsibleName={formData.responsible_name}
            deadlineDate={deadlineDate}
            onInputChange={handleInputChange}
            onDeadlineChange={setDeadlineDate}
            isReadOnly={true} // Disable immediate actions field
          />

          {/* Evidências */}
          <EvidenceCard
            files={files}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
          />

          {/* Form Actions */}
          <FormActions 
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />
        </div>
      </form>
    </Form>
  );
};

export default FormContainer;
