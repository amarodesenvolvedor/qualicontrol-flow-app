
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import FormContainer from "./nonconformance/FormContainer";

const NonConformanceForm = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registrar Nova Não Conformidade</h1>
        <p className="text-muted-foreground">
          Preencha o formulário abaixo para registrar uma nova ocorrência
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900 mb-6">
        <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle>Novo fluxo de registro</AlertTitle>
        <AlertDescription>
          O campo "Ações Imediatas Tomadas" será preenchido pelo responsável do departamento após receber uma notificação por e-mail.
          O campo "Responsável pela Ação" deve conter o nome da pessoa responsável por implementar as ações corretivas.
        </AlertDescription>
      </Alert>

      <FormContainer />
    </div>
  );
};

export default NonConformanceForm;
