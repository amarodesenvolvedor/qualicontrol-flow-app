
import { Form } from "@/components/ui/form";
import { useNonConformanceFormProvider } from "@/hooks/useNonConformanceFormProvider";
import BasicInfoForm from "./form/BasicInfoForm";
import CategoryForm from "./form/CategoryForm";
import ActionsForm from "./form/ActionsForm";
import EvidenceForm from "./form/EvidenceForm";
import FormActions from "./form/FormActions";

const FormContainer = () => {
  const {
    form,
    files,
    isSubmitting,
    handleFileChange,
    removeFile,
    onSubmit,
    handleCancel
  } = useNonConformanceFormProvider();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-6">
          <BasicInfoForm control={form.control} />
          <CategoryForm control={form.control} />
          <ActionsForm control={form.control} />
          <EvidenceForm 
            files={files}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
          />
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
