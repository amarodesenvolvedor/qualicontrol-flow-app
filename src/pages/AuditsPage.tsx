
import { useState } from "react";
import { useDepartments } from "@/hooks/useDepartments";
import { useAuditReports } from "@/hooks/useAuditReports";
import Layout from "@/components/app/Layout";
import { AuditFilters } from "@/components/audits/AuditFilters";
import { AuditReportList } from "@/components/audits/AuditReportList";
import { NewAuditForm } from "@/components/audits/NewAuditForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon, ListChecks } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditCalendarView from "@/components/audits/AuditCalendarView";
import { ScheduledAudits } from "@/components/audits/ScheduledAudits";
import { useScheduledAudits } from "@/hooks/useScheduledAudits";

const AuditsPage = () => {
  const [selectedTab, setSelectedTab] = useState("list");
  
  const { departments } = useDepartments();
  
  const {
    auditReports,
    isLoading,
    filters,
    setFilters,
    createAuditReport,
    deleteAuditReport,
  } = useAuditReports();

  const { scheduledAudits } = useScheduledAudits();

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Combine audit reports and scheduled audits for calendar view
  const calendarEvents = [...auditReports];

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Auditorias</h1>
          {selectedTab !== "scheduled" && (
            <Button onClick={() => setSelectedTab(selectedTab === "new" ? "list" : "new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {selectedTab === "new" ? "Voltar para Lista" : "Nova Auditoria"}
            </Button>
          )}
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="scheduled">
              <ListChecks className="mr-2 h-4 w-4" />
              Auditorias Programadas
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="new">Nova Auditoria</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <div className="space-y-4">
              <AuditFilters 
                departments={departments}
                filters={filters}
                onFilterChange={handleFiltersChange}
              />
              <AuditReportList 
                auditReports={auditReports}
                isLoading={isLoading}
                onDelete={(id) => deleteAuditReport.mutate(id)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled">
            <div className="space-y-4">
              <ScheduledAudits />
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className="space-y-4">
              <AuditCalendarView 
                auditReports={auditReports} 
                scheduledAudits={scheduledAudits}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <NewAuditForm 
              departments={departments}
              onSubmit={data => createAuditReport.mutate(data)}
              isSubmitting={createAuditReport.isPending}
              onCancel={() => setSelectedTab("list")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AuditsPage;
