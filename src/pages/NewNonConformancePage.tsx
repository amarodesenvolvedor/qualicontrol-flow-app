
import Layout from "@/components/app/Layout";
import NonConformanceForm from "@/components/app/NonConformanceForm";

const NewNonConformancePage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <NonConformanceForm />
      </div>
    </Layout>
  );
};

export default NewNonConformancePage;
