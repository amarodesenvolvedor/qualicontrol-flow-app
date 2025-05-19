
import { useState } from "react";
import { useAuditReportsCrud } from "@/hooks/useAuditReportsCrud";
import { AuditReportInput } from "@/types/audit";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import BasicInfoFields from "@/components/audits/form/BasicInfoFields";
import DateStatusFields from "@/components/audits/form/DateStatusFields";
import FileUploadField from "@/components/audits/form/FileUploadField";
import FormActions from "@/components/audits/form/FormActions";
import FormHeader from "@/components/audits/form/FormHeader";

interface NewAuditFormProps {
  departments: any[];
  onSubmit: (data: { data: AuditReportInput, file: File }) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const NewAuditForm = ({
  departments,
  onSubmit,
  isSubmitting,
  onCancel
}: NewAuditFormProps) => {
  const { isUploading, uploadProgress } = useAuditReportsCrud();
  const [formData, setFormData] = useState<AuditReportInput>({
    title: "",
    description: "",
    department_id: "",
    audit_date: new Date().toISOString().split('T')[0],
    status: "pending",
    file_name: "",
    file_size: 0,
    file_type: "",
    responsible_auditor: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFileError(null);
    setSelectedFile(file);
    
    if (file) {
      setFormData(prev => ({
        ...prev,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        file_name: "",
        file_size: 0,
        file_type: ""
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, forneça um título para o relatório de auditoria.",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.department_id) {
      toast({
        title: "Departamento obrigatório",
        description: "Por favor, selecione um departamento.",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.responsible_auditor) {
      toast({
        title: "Auditor responsável obrigatório",
        description: "Por favor, forneça o nome do auditor responsável.",
        variant: "destructive"
      });
      return false;
    }
    if (!selectedFile) {
      setFileError("Por favor, selecione um arquivo de relatório de auditoria.");
      toast({
        title: "Arquivo obrigatório",
        description: "Por favor, selecione um arquivo de relatório de auditoria.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm() && selectedFile) {
      onSubmit({ data: formData, file: selectedFile });
    }
  };

  return (
    <Card>
      <FormHeader title="Novo Relatório de Auditoria" />
      
      <div className="space-y-6 p-6">
        <BasicInfoFields
          title={formData.title}
          description={formData.description || ""}
          departmentId={formData.department_id}
          responsibleAuditor={formData.responsible_auditor}
          departments={departments}
          onTitleChange={(value) => handleInputChange("title", value)}
          onDescriptionChange={(value) => handleInputChange("description", value)}
          onDepartmentChange={(value) => handleInputChange("department_id", value)}
          onResponsibleAuditorChange={(value) => handleInputChange("responsible_auditor", value)}
        />

        <DateStatusFields
          auditDate={formData.audit_date}
          status={formData.status}
          onAuditDateChange={(value) => handleInputChange("audit_date", value)}
          onStatusChange={(value) => handleInputChange("status", value)}
        />

        <FileUploadField 
          onFileChange={handleFileChange} 
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          error={fileError}
        />
      </div>

      <FormActions
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting || isUploading}
      />
    </Card>
  );
};
