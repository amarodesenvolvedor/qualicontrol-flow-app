
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
import { useNonConformances, NonConformance } from "@/hooks/useNonConformances";
import { useDepartments } from "@/hooks/useDepartments";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "completed", label: "Concluído" },
  { value: "in-progress", label: "Em Andamento" },
  { value: "critical", label: "Crítico" },
  { value: "pending", label: "Pendente" }
];

const NonConformanceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isFiltering, setIsFiltering] = useState(false);
  
  const { getNonConformances } = useNonConformances();
  const { data: departments } = useDepartments();
  
  const { data: nonConformances = [], isLoading, error } = getNonConformances;

  // Construir opções de departamento dinamicamente
  const departmentOptions = [
    { value: "all", label: "Todos os Departamentos" },
    ...(departments?.map(dept => ({ 
      value: dept.id,
      label: dept.name
    })) || [])
  ];

  // Filtrar não conformidades baseado nos filtros
  const filteredItems = nonConformances.filter((item: NonConformance) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    const matchesDepartment = departmentFilter === "all" || 
                             item.department_id === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleSearch = () => {
    setIsFiltering(true);
    // Simulando delay de pesquisa
    setTimeout(() => {
      setIsFiltering(false);
    }, 300);
  };

  // Formatação de datas
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };

  // Função para renderizar o icon do status
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="status-badge status-completed">
            <Check className="mr-1 h-3 w-3" />
            Concluído
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="status-badge status-in-progress">
            <Loader2 className="mr-1 h-3 w-3" />
            Em Andamento
          </Badge>
        );
      case "critical":
        return (
          <Badge variant="outline" className="status-badge status-critical">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Crítico
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="outline" className="status-badge status-pending">
            <Clock className="mr-1 h-3 w-3" />
            Pendente
          </Badge>
        );
    }
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
                  placeholder="Buscar por ID, título ou descrição..."
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
              <Button onClick={handleSearch} disabled={isFiltering || isLoading}>
                {isFiltering || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLoading ? "Carregando" : "Filtrando"}
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
        <h2 className="text-lg font-medium">
          {isLoading ? "Carregando dados..." : `Resultados (${filteredItems.length})`}
        </h2>
        
        {error ? (
          <div className="p-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <h3 className="mt-2 text-lg font-medium">Erro ao carregar dados</h3>
            <p className="text-muted-foreground">
              Ocorreu um erro ao buscar as não conformidades. Tente novamente mais tarde.
            </p>
          </div>
        ) : isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Carregando dados</h3>
            <p className="text-muted-foreground">
              Por favor, aguarde enquanto carregamos as não conformidades.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center">
            <FileX className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Nenhuma não conformidade encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou criar uma nova não conformidade.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item: NonConformance) => (
              <Card key={item.id} className="card-hover">
                <CardContent className="p-0">
                  <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/nao-conformidades/${item.id}`}
                          className="font-medium hover:underline"
                        >
                          {item.code}
                        </Link>
                        {renderStatusBadge(item.status)}
                      </div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end justify-between text-sm">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">
                          Departamento: {item.departments?.name || "Não especificado"}
                        </div>
                        <div className="text-muted-foreground">
                          Responsável: {item.responsible_name}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center mt-2">
                        <span className="text-muted-foreground">
                          {formatDate(item.occurrence_date)}
                        </span>
                        {item.deadline_date && (
                          <>
                            <span>→</span>
                            <span className="text-muted-foreground font-medium">
                              {formatDate(item.deadline_date)}
                            </span>
                          </>
                        )}
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
