
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon, Upload, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";

const departmentOptions = [
  { value: "production", label: "Produção" },
  { value: "maintenance", label: "Manutenção" },
  { value: "quality", label: "Qualidade" },
  { value: "safety", label: "Segurança" },
  { value: "logistics", label: "Logística" },
  { value: "purchasing", label: "Compras" }
];

const categoryOptions = [
  { value: "quality", label: "Qualidade" },
  { value: "safety", label: "Segurança" },
  { value: "process", label: "Processo" },
  { value: "documentation", label: "Documentação" },
  { value: "environmental", label: "Ambiental" },
  { value: "training", label: "Treinamento" }
];

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
    auditorName: "", // Novo campo para o nome do auditor
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
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Título resumido da não conformidade"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição Detalhada <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva detalhadamente o ocorrido"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="location">Local da Ocorrência <span className="text-red-500">*</span></Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Setor, linha ou local específico"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Data da Ocorrência <span className="text-red-500">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          locale={ptBR}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="auditorName">Nome do Auditor <span className="text-red-500">*</span></Label>
                  <Input
                    id="auditorName"
                    name="auditorName"
                    placeholder="Nome completo do auditor"
                    value={formData.auditorName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categorização */}
          <Card>
            <CardHeader>
              <CardTitle>Categorização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="department">Departamento <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => 
                      setFormData({...formData, department: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoria <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => 
                      setFormData({...formData, category: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações e Responsabilidades */}
          <Card>
            <CardHeader>
              <CardTitle>Ações e Responsabilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="immediateActions">Ações Imediatas Tomadas</Label>
                  <Textarea
                    id="immediateActions"
                    name="immediateActions"
                    placeholder="Descreva as ações tomadas para minimizar o impacto"
                    rows={3}
                    value={formData.immediateActions}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="responsibleName">Responsável pelo Registro <span className="text-red-500">*</span></Label>
                  <Input
                    id="responsibleName"
                    name="responsibleName"
                    placeholder="Nome do responsável pelo registro"
                    value={formData.responsibleName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Novo campo para prazo da ação */}
                <div className="grid gap-2">
                  <Label>Prazo para Ação Corretiva <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadlineDate ? (
                          format(deadlineDate, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione o prazo</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadlineDate}
                        onSelect={setDeadlineDate}
                        locale={ptBR}
                        disabled={(date) => date < new Date()}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evidências */}
          <Card>
            <CardHeader>
              <CardTitle>Evidências</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="files">Anexar Arquivos</Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Arraste arquivos ou clique para fazer upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (Imagens, documentos, PDFs - máx. 10MB cada)
                    </p>
                    <Input
                      id="files"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => document.getElementById('files')?.click()}
                    >
                      Selecionar Arquivos
                    </Button>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="grid gap-2">
                    <Label>Arquivos Selecionados ({files.length})</Label>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li 
                          key={index} 
                          className="flex items-center justify-between bg-muted p-2 rounded-md"
                        >
                          <span className="text-sm truncate">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFile(index)}
                          >
                            Remover
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Registrar Não Conformidade'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NonConformanceForm;
