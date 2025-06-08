import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | CesdeAcademic - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for CesdeAcademic - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Calificaciones" />
      <div className="space-y-6">
        <ComponentCard title="Ver detalles">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
