
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import BasicInfoCard from "./nonconformance/BasicInfoCard";
import CategoryCard from "./nonconformance/CategoryCard";
import ActionsCard from "./nonconformance/ActionsCard";
import EvidenceCard from "./nonconformance/EvidenceCard";
import FormActions from "./nonconformance/FormActions";

const NonConformanceForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    department: "",
    category: "",
    immediateActions: "",
    responsibleName: "",
    auditorName: "",
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
    setFormData({...formData, department: value});
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData({...formData, category: value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Não Conformidade Registrada",
        description: "Sua não conformidade foi registrada com sucesso! ID: NC-2023-046"
      });
      
      navigate("/nao-conformidades");
    }, 1500);
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
            auditorName={formData.auditorName}
            selectedDate={selectedDate}
            onInputChange={handleInputChange}
            onDateChange={setSelectedDate}
          />

          {/* Categorização */}
          <CategoryCard
            department={formData.department}
            category={formData.category}
            onDepartmentChange={handleDepartmentChange}
            onCategoryChange={handleCategoryChange}
          />

          {/* Ações e Responsabilidades */}
          <ActionsCard
            immediateActions={formData.immediateActions}
            responsibleName={formData.responsibleName}
            deadlineDate={deadlineDate}
            onInputChange={handleInputChange}
            onDeadlineChange={setDeadlineDate}
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
