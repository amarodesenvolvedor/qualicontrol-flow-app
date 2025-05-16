
import Layout from "@/components/app/Layout";
import Dashboard from "@/components/app/Dashboard";
import { Suspense, useState, useEffect } from "react";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Add some time for data to load properly
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <Suspense fallback={<DashboardLoadingState />}>
        {isLoading ? (
          <DashboardLoadingState />
        ) : (
          <Dashboard />
        )}
      </Suspense>
    </Layout>
  );
};

export default Index;
