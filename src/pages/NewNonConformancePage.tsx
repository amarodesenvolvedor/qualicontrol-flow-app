
import Layout from "@/components/app/Layout";
import NonConformanceForm from "@/components/app/NonConformanceForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const NewNonConformancePage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900 mb-6">
          <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>Novo fluxo de registro</AlertTitle>
          <AlertDescription>
            O campo "Ações Imediatas Tomadas" será preenchido pelo responsável do departamento após receber uma notificação por e-mail.
            O campo "Responsável pela Ação" deve conter o nome da pessoa responsável por implementar as ações corretivas.
          </AlertDescription>
        </Alert>
        <NonConformanceForm />
      </div>
    </Layout>
  );
};

export default NewNonConformancePage;
