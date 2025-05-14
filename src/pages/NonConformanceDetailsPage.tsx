
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/app/Layout";
import HistoryList from "@/components/app/HistoryList";
import StatusBadge from "@/components/app/nonconformance/details/StatusBadge";
import DetailsTab from "@/components/app/nonconformance/details/DetailsTab";
import PageHeader from "@/components/app/nonconformance/details/PageHeader";
import LoadingState from "@/components/app/nonconformance/details/LoadingState";
import ErrorState from "@/components/app/nonconformance/details/ErrorState";
import { useNonConformanceDetails } from "@/hooks/useNonConformanceDetails";

const NonConformanceDetailsPage = () => {
  const {
    id,
    nonConformance,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    exportToPDF,
    exportToExcel
  } = useNonConformanceDetails();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !nonConformance) {
    return <ErrorState />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader id={id} />

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>{nonConformance.code} - {nonConformance.title}</span>
              <StatusBadge status={nonConformance.status} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="pt-4">
                <DetailsTab 
                  nonConformance={nonConformance} 
                  onExportToPDF={exportToPDF}
                  onExportToExcel={exportToExcel}
                />
              </TabsContent>
              
              <TabsContent value="history" className="pt-4">
                <HistoryList entityType="non_conformance" entityId={id || ''} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NonConformanceDetailsPage;
