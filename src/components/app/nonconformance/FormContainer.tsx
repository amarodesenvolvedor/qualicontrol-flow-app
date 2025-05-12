
import { useNonConformanceForm } from "@/hooks/useNonConformanceForm";
import BasicInfoCard from "./BasicInfoCard";
import CategoryCard from "./CategoryCard";
import ActionsCard from "./ActionsCard";
import EvidenceCard from "./EvidenceCard";
import FormActions from "./FormActions";
import { FormProvider } from "react-hook-form";

const FormContainer = () => {
  const {
    formData,
    selectedDate,
    deadlineDate,
    effectivenessVerificationDate,
    completionDate,
    files,
    isSubmitting,
    form,
    handleInputChange,
    handleFileChange,
    removeFile,
    handleDepartmentChange,
    handleCategoryChange,
    handleStatusChange,
    setSelectedDate,
    setDeadlineDate,
    setEffectivenessVerificationDate,
    setCompletionDate,
    handleSubmit,
    handleCancel
  } = useNonConformanceForm();

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
            effectivenessVerificationDate={effectivenessVerificationDate}
            completionDate={completionDate}
            onInputChange={handleInputChange}
            onDeadlineChange={setDeadlineDate}
            onEffectivenessVerificationDateChange={setEffectivenessVerificationDate}
            onCompletionDateChange={setCompletionDate}
            isReadOnly={false}
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
    </FormProvider>
  );
};

export default FormContainer;
