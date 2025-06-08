import { useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BarChartOne from "../../components/charts/bar/BarChartOne";
import LineChartOne from "../../components/charts/line/LineChartOne";
import PieChartOne from "./PieChartOne";
import StackedBarChart from "./StackedBarChart";

export default function ChartsDashboard() {
  useEffect(() => {
    const getAnalytics = async () => {
      const usuario = localStorage.getItem("usuario");
      if (!usuario) return;

      const id = JSON.parse(usuario).id;

      try {
        const [resAsistencias, resCalificaciones, resDocentes] = await Promise.all([
          fetch(`https://cesde-academic-analytics-production.up.railway.app/estudiantes/${id}/asistencias`),
          fetch(`https://cesde-academic-analytics-production.up.railway.app/estudiantes/${id}/califiaciones`),
          fetch(`https://cesde-academic-analytics-production.up.railway.app/docentes/${id}/notas`)
        ]);

        const dataAsistencias = await resAsistencias.json();
        const dataCalificaciones = await resCalificaciones.json();
        const dataDocentes = await resDocentes.json();

        console.log("Asistencias del usuario:", dataAsistencias);
        console.log("Calificaciones del usuario:", dataCalificaciones);
        console.log("Promedio notas docentes:", dataDocentes);
      } catch (error) {
        console.error("Error al obtener datos analíticos:", error);
      }
    };

    getAnalytics();
  }, []);

  return (
    <div>
      <PageMeta
        title="React.js Chart Dashboard | CesdeAcademic - React.js Admin Dashboard Template"
        description="Combined chart dashboard with Bar, Line, and Pie charts for CesdeAcademic"
      />
      <PageBreadcrumb pageTitle="Dashboard de Gráficas" />

      {/* Contenedor de 2 columnas con espacio entre ellas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primera columna */}
        <div className="space-y-6">
          <ComponentCard title="Gráfico de Barras">
            <BarChartOne />
          </ComponentCard>

          <ComponentCard title="Gráfico Circular">
            <PieChartOne />
          </ComponentCard>
        </div>

        {/* Segunda columna */}
        <div className="space-y-6">
          <ComponentCard title="Gráfico de Línea">
            <LineChartOne />
          </ComponentCard>

          <ComponentCard title="Gráfico de Barras Apiladas">
            <StackedBarChart />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
