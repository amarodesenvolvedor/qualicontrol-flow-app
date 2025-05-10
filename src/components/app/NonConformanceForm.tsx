
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import BasicInfoCard from "./nonconformance/BasicInfoCard";
import CategoryCard from "./nonconformance/CategoryCard";
import ActionsCard from "./nonconformance/ActionsCard";
import EvidenceCard from "./nonconformance/EvidenceCard";
import FormActions from "./nonconformance/FormActions";
import { useNonConformances } from "@/hooks/useNonConformances";
import { format } from "date-fns";

const NonConformanceForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createNonConformance, error: apiError } = useNonConformances();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    department_id: "",
    category: "",
    immediate_actions: "",
    responsible_name: "",
    auditor_name: "",
    root_cause: "",
    corrective_actions: "",
    preventive_actions: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const handleDepartmentChange = (value: string) => {
    setFormData({...formData, department_id: value});
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData({...formData, category: value});
  };

  // Mock function for uploading files
  const uploadFiles = async (nonConformanceId: string) => {
    if (files.length === 0) return [];
    
    // Implementation would go here in a real app
    console.log(`Uploading ${files.length} files for non-conformance ${nonConformanceId}`);
    return [];
  };

  // Mock function to send email notification to department responsible
  const sendNotificationEmail = async (nonConformanceId: string, departmentId: string, responsibleName: string) => {
    try {
      // In a real implementation, this would call an API endpoint or edge function
      console.log(`Sending notification email for NC ${nonConformanceId} to responsible: ${responsibleName} of department: ${departmentId}`);
      
      // Simulate successful email sending
      toast({
        title: "Notificação enviada",
        description: `Uma notificação foi enviada para ${responsibleName} para preencher as ações imediatas.`
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Verificar se os campos obrigatórios estão preenchidos
    if (!formData.title || !formData.description || !formData.department_id || 
        !formData.category || !formData.location || !formData.auditor_name || 
        !formData.responsible_name || !selectedDate || !deadlineDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Criar a não conformidade - Observe que o campo immediate_actions estará vazio inicialmente
      const nonConformanceData = {
        ...formData,
        immediate_actions: "", // Este campo será preenchido posteriormente pelo responsável
        occurrence_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        deadline_date: deadlineDate ? format(deadlineDate, 'yyyy-MM-dd') : null,
        status: 'pending' as const
      };
      
      const result = await createNonConformance.mutateAsync(nonConformanceData);
      
      // 2. Se tiver arquivos, fazer o upload
      if (files.length > 0 && result) {
        await uploadFiles(result.id);
      }
      
      // 3. Enviar notificação para o responsável pelo departamento
      if (result) {
        await sendNotificationEmail(result.id, formData.department_id, formData.responsible_name);
      }
      
      // 4. Mostrar mensagem de sucesso e redirecionar
      toast({
        title: "Não Conformidade Registrada",
        description: `Sua não conformidade foi registrada com sucesso! ID: ${result?.code}`
      });
      
      navigate("/nao-conformidades");
    } catch (error) {
      console.error("Erro ao salvar não conformidade:", error);
      toast({
        title: "Erro ao registrar",
        description: apiError ? apiError.message : "Ocorreu um erro ao registrar a não conformidade.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/nao-conformidades");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registrar Nova Não Conformidade</h1>
        <p className="text-muted-foreground">
          Preencha o formulário abaixo para registrar uma nova ocorrência
        </p>
      </div>

      <form onSubmit={handleSubmit}>
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
            onDepartmentChange={handleDepartmentChange}
            onCategoryChange={handleCategoryChange}
          />

          {/* Ações e Responsabilidades */}
          <ActionsCard
            immediateActions={formData.immediate_actions}
            responsibleName={formData.responsible_name}
            deadlineDate={deadlineDate}
            onInputChange={handleInputChange}
            onDeadlineChange={setDeadlineDate}
            isReadOnly={true} // Desabilita a edição do campo de ações imediatas
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
    </div>
  );
};

export default NonConformanceForm;
