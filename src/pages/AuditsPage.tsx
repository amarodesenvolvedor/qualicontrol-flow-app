
import { useState } from "react";
import { useDepartments } from "@/hooks/useDepartments";
import { useAuditReports } from "@/hooks/useAuditReports";
import Layout from "@/components/app/Layout";
import AuditFilters from "@/components/audits/AuditFilters";
import AuditReportList from "@/components/audits/AuditReportList";
import NewAuditForm from "@/components/audits/NewAuditForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuditsPage = () => {
  const [showNewAuditForm, setShowNewAuditForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState("list");
  
  const { departments } = useDepartments();
  
  const {
    audits,
    isLoading,
    filters,
    setFilters,
    createAudit,
  } = useAuditReports();

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Auditorias</h1>
          <Button onClick={() => {
            setShowNewAuditForm(!showNewAuditForm);
            setSelectedTab(showNewAuditForm ? "list" : "new");
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {showNewAuditForm ? "Voltar para Lista" : "Nova Auditoria"}
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="list">Lista de Auditorias</TabsTrigger>
            <TabsTrigger value="new">Nova Auditoria</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <div className="space-y-4">
              <AuditFilters 
                departments={departments}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
              <AuditReportList 
                audits={audits}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <NewAuditForm 
              departments={departments}
              onSubmit={(data) => createAudit.mutate(data)}
              isSubmitting={createAudit.isPending}
              onCancel={() => {
                setShowNewAuditForm(false);
                setSelectedTab("list");
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AuditsPage;
