
import Layout from "@/components/app/Layout";
import Dashboard from "@/components/app/Dashboard";
import { Suspense } from "react";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

const Index = () => {
  return (
    <Layout>
      <Suspense fallback={<DashboardLoadingState />}>
        <Dashboard />
      </Suspense>
    </Layout>
  );
};

export default Index;
