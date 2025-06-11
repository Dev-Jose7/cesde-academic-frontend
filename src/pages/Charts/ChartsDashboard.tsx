import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BarChartOne from "../../components/charts/bar/BarChartOne";
import LineChartOne from "../../components/charts/line/LineChartOne";
import PieChartOne from "./PieChartOne";
import { fetchAuth } from "../../utils/fetchAuth";
import BarChartDocente from "./BarChartDocente";
import PieChartDocente from "./PieChartDocente";
import LineChartDocente from "./LineChartDocente";
import { hideLoader, showLoader } from "../../components/common/Loader";


export default function ChartsDashboard() {
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);

  // Estudiante
  const [asistenciasOne, setAsistenciasOne] = useState<{ [key: string]: number }>({});
  const [asistenciasTwo, setAsistenciasTwo] = useState<any[]>([]);
  const [calificaciones, setCalificaciones] = useState<any[]>([]);

  // Docente
  const [notasDocentes, setNotasDocentes] = useState<any[]>([]);
  const [asistenciasDocente, setAsistenciasDocente] = useState<any[]>([]);
  const [porcentajeDocente, setPorcentajeDocente] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const getAnalytics = async () => {
      const usuarioStr = localStorage.getItem("usuario");
      if (!usuarioStr) return;

      const usuario = JSON.parse(usuarioStr);
      const { id, tipo } = usuario;
      setTipoUsuario(tipo);

      try {
        showLoader("Cargando gráficos...")
        if (tipo === "ESTUDIANTE") {
          const [resAsistenciasOne, resAsistenciasTwo, resCalificaciones] = await Promise.all([
            fetchAuth(`/analytics/estudiantes/${id}/asistencias/one/${tipo}`),
            fetchAuth(`/analytics/estudiantes/${id}/asistencias/two/${tipo}`),
            fetchAuth(`/analytics/estudiantes/${id}/calificaciones/three/${tipo}`)
          ]);

          const dataAsistenciasOne = await resAsistenciasOne.json();
          const dataAsistenciasTwo = await resAsistenciasTwo.json();
          const dataCalificaciones = await resCalificaciones.json();

          setAsistenciasOne(dataAsistenciasOne);
          setAsistenciasTwo(dataAsistenciasTwo);
          setCalificaciones(dataCalificaciones);

          console.log(dataAsistenciasOne, dataAsistenciasTwo, dataCalificaciones)

        } else if (tipo === "DOCENTE") {
          const [resNotas, resAsistencia, resPorcentajes] = await Promise.all([
            fetchAuth(`/analytics/docentes/${id}/notas/one/${tipo}`),
            fetchAuth(`/analytics/docentes/${id}/asistencia/two/${tipo}`),
            fetchAuth(`/analytics/docentes/${id}/asistencias/porcentajes/three/${tipo}`)
          ]);

          const dataNotas = await resNotas.json();
          const dataAsistencia = await resAsistencia.json();
          const dataPorcentajes = await resPorcentajes.json();

          console.log(dataNotas, dataAsistencia, dataPorcentajes);

          setNotasDocentes(dataNotas);
          setAsistenciasDocente(dataAsistencia);
          setPorcentajeDocente(dataPorcentajes);
        }
      } catch (error) {
        console.error("Error al obtener datos analíticos:", error);
      } finally {
        hideLoader()
      }
    };

    getAnalytics();
  }, []);

  return (
    <div>
      <PageMeta
        title="Dashboard de Gráficas | CesdeAcademic"
        description="Visualización analítica con gráficos personalizados según tipo de usuario"
      />
      <PageBreadcrumb pageTitle="Dashboard de Gráficas" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* === ESTUDIANTE === */}
        {tipoUsuario === "ESTUDIANTE" && (
          <>
            <div className="space-y-6">
              <ComponentCard title="Cantidad de asistencias del estudiante">
                <BarChartOne data={asistenciasTwo} />
              </ComponentCard>

              <ComponentCard title="Distribución de asistencias">
                <PieChartOne dataObj={asistenciasOne} />
              </ComponentCard>
            </div>

            <div className="space-y-6">
              <ComponentCard title="Calificaciones del estudiante">
                <LineChartOne data={calificaciones} />
              </ComponentCard>

              <ComponentCard title="Cantidad de asistencias del estudiante">
                <BarChartOne data={asistenciasOne} />
              </ComponentCard>
            </div>
          </>
        )}

        {/* === DOCENTE === */}
        {tipoUsuario === "DOCENTE" && (
          <>
            <div className="space-y-6">
              <ComponentCard title="Promedio de notas por estudiante">
                <BarChartDocente data={notasDocentes} tipo="notas" />
              </ComponentCard>

              <ComponentCard title="Distribución">
                <PieChartDocente dataObj={porcentajeDocente}/>
              </ComponentCard>
            </div>

            <div className="space-y-6">
              <ComponentCard title="Inasistencias por estudiante">
                <LineChartDocente data={asistenciasDocente} />
              </ComponentCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
