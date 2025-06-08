import { useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import LineChartOne from "../../components/charts/line/LineChartOne";
import PageMeta from "../../components/common/PageMeta";
import { fetchAuth } from "../../utils/fetchAuth";

export default function LineChart() {
  useEffect(() => {
    const getAnalytics = async () => {
      const usuario = localStorage.getItem("usuario");
      if (!usuario) return;

      const id = JSON.parse(usuario).id;
      const tipo = JSON.parse(usuario).tipo;

      try {
        switch (tipo) {
          case "ESTUDIANTE": {
            const responseAsistencias = await fetchAuth(
              `/analytics/estudiantes/${id}/asistencias/one/${tipo}`,
              { method: "GET" }
            );
            const responseCalificaciones = await fetchAuth(
              `/analytics/estudiantes/${id}/calificaciones/three/${tipo}`,
              { method: "GET" }
            );

            const dataAsistencias = await responseAsistencias.json();
            const dataCalificaciones = await responseCalificaciones.json();

            console.log("Asistencias del usuario:", dataAsistencias);
            console.log("Calificaciones del usuario:", dataCalificaciones);
            break;
          }

          case "DOCENTE": {
            const responseDocentes = await fetchAuth(
              `/analytics/docentes/${id}/notas/one/${tipo}`,
              { method: "GET" }
            );

            const dataDocentes = await responseDocentes.json();
            console.log(
              "Promedio de notas de los estudiantes del docente:",
              dataDocentes
            );
            break;
          }

          default:
            console.warn("Tipo de usuario no reconocido:", tipo);
        }
      } catch (error) {
        console.error("Error obteniendo analíticas:", error);
      }
    };

    getAnalytics();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Chart Dashboard | CesdeAcademic"
        description="Visualización de datos académicos para estudiantes y docentes"
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
