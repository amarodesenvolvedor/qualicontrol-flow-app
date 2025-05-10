
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { 
  Check, Loader2, 
  FileX, Clock, AlertTriangle, 
  Search, SlidersHorizontal, Plus 
} from "lucide-react";

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "completed", label: "Concluído" },
  { value: "in-progress", label: "Em Andamento" },
  { value: "critical", label: "Crítico" },
  { value: "pending", label: "Pendente" }
];

const departmentOptions = [
  { value: "all", label: "Todos os Departamentos" },
  { value: "production", label: "Produção" },
  { value: "maintenance", label: "Manutenção" },
  { value: "quality", label: "Qualidade" },
  { value: "safety", label: "Segurança" },
  { value: "logistics", label: "Logística" },
  { value: "purchasing", label: "Compras" }
];

// Mock data for non-conformances
const mockNonConformances = [
  {
    id: "NC-2023-045",
    title: "Falha no sistema de refrigeração",
    description: "Sistema apresentou oscilação de temperatura fora dos limites estabelecidos",
    status: "critical",
    department: "Manutenção",
    date: "10/05/2023",
    dueDate: "20/05/2023",
    responsible: "Carlos Silva"
  },
  {
    id: "NC-2023-044",
    title: "Produto fora de especificação",
    description: "Lote XYZ123 apresentou variação dimensional acima do limite",
    status: "in-progress",
    department: "Qualidade",
    date: "09/05/2023",
    dueDate: "18/05/2023",
    responsible: "Ana Torres"
  },
  {
    id: "NC-2023-043",
    title: "Falta de EPI no setor de produção",
    description: "Colaboradores sem proteção auditiva durante operação de maquinário",
    status: "in-progress",
    department: "Segurança",
    date: "08/05/2023",
    dueDate: "15/05/2023",
    responsible: "Marcos Oliveira"
  },
  {
    id: "NC-2023-042",
    title: "Documentação incompleta",
    description: "Registros de calibração incompletos para equipamentos do setor A",
    status: "completed",
    department: "Qualidade",
    date: "07/05/2023",
    dueDate: "14/05/2023",
    responsible: "Juliana Mendes"
  },
  {
    id: "NC-2023-041",
    title: "Fornecedor não enviou certificados",
    description: "Material recebido sem a documentação completa conforme exigido",
    status: "pending",
    department: "Compras",
    date: "05/05/2023",
    dueDate: "12/05/2023",
    responsible: "Paulo Gomes"
  },
  {
    id: "NC-2023-040",
    title: "Erro no processo de embalagem",
    description: "Produtos embalados com filme incorreto para o tipo específico",
    status: "completed",
    department: "Produção",
    date: "03/05/2023",
    dueDate: "10/05/2023",
    responsible: "Rafaela Santos"
  },
  {
    id: "NC-2023-039",
    title: "Atraso na entrega de matéria-prima",
    description: "Fornecedor não entregou no prazo acordado, causando atraso na produção",
    status: "pending",
    department: "Logística",
    date: "02/05/2023",
    dueDate: "09/05/2023",
    responsible: "Ricardo Alves"
  },
];

const NonConformanceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Filter non-conformances based on filters
  const filteredItems = mockNonConformances.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || 
                             item.department.toLowerCase() === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Não Conformidades</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as não conformidades registradas
          </p>
        </div>
        <Button asChild>
          <Link to="/nao-conformidades/nova">
            <Plus className="mr-2 h-4 w-4" /> Registrar Nova
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por ID ou título..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="col-span-1 md:col-span-4 flex justify-end space-x-2">
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros Avançados
              </Button>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Resultados ({filteredItems.length})</h2>
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center">
            <FileX className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Nenhuma não conformidade encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou criar uma nova não conformidade.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map(item => (
              <Card key={item.id} className="card-hover">
                <CardContent className="p-0">
                  <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/nao-conformidades/${item.id}`}
                          className="font-medium hover:underline"
                        >
                          {item.id}
                        </Link>
                        <Badge variant="outline" className={`status-badge status-${item.status}`}>
                          {item.status === "completed" && (
                            <span className="flex items-center">
                              <Check className="mr-1 h-3 w-3" />
                              Concluído
                            </span>
                          )}
                          {item.status === "in-progress" && (
                            <span className="flex items-center">
                              <Loader2 className="mr-1 h-3 w-3" />
                              Em Andamento
                            </span>
                          )}
                          {item.status === "critical" && (
                            <span className="flex items-center">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Crítico
                            </span>
                          )}
                          {item.status === "pending" && (
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              Pendente
                            </span>
                          )}
                        </Badge>
                      </div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end justify-between text-sm">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Departamento: {item.department}</div>
                        <div className="text-muted-foreground">Responsável: {item.responsible}</div>
                      </div>
                      <div className="flex gap-2 items-center mt-2">
                        <span className="text-muted-foreground">{item.date}</span>
                        <span>→</span>
                        <span className="text-muted-foreground font-medium">{item.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NonConformanceList;
