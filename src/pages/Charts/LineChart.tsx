import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import LineChartOne from "../../components/charts/line/LineChartOne";
import PageMeta from "../../components/common/PageMeta";
import { useEffect } from "react";

export default function LineChart() {

  useEffect(() => {
    const getAnalitycs = async () => {
      const usuario = localStorage.getItem("usuario");
      if (!usuario) return;

      const id = JSON.parse(usuario).id;
      try {
        const responseAsistencias = await fetch(`https://cesde-academic-analytics-production.up.railway.app/estudiantes/${id}/asistencias`);
        const responseCalificaciones = await fetch(`https://cesde-academic-analytics-production.up.railway.app/estudiantes/${id}/califiaciones`);
        const responseDocentes = await fetch(`https://cesde-academic-analytics-production.up.railway.app/docentes/${id}/notas`);

        const dataAsistencias = await responseAsistencias.json();
        const dataCalificaciones = await responseCalificaciones.json();
        const dataDocentes = await responseDocentes.json();

        console.log("Asistencias del usuario: ", dataAsistencias);
        console.log("Calificaciones usuario: ", dataCalificaciones);
        console.log("Promedio de notas de los estudiantes del docente: ", dataDocentes);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    getAnalitycs();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Chart Dashboard | CesdeAcademic - React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for CesdeAcademic - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart 1">
          <LineChartOne />
        </ComponentCard>
      </div>
    </>
  );
}
