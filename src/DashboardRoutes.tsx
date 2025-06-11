import { Routes, Route } from "react-router-dom";
import { useUser } from "./context/UserContext";

// Componentes existentes
import Home from "./pages/Dashboard/Home";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import ChartsDashboard from "./pages/Charts/ChartsDashboard";
import ActividadesPanelEstudent from "./pages/UiElements/ActividadesPanelEstudent";
import BasicTables from "./pages/Tables/BasicTables";
import AsistenciaPage from "./pages/UiElements/AsistenciasPage";
import Avatars from "./pages/UiElements/AnunciosList";
import BasicTableOneTeacher from "./components/tables/BasicTables/BasicTableOneTeacher";
import ManagementPrograms from "./pages/Directivos/Managementprograms";
import SchoolsDirectives from "./pages/Directivos/SchoolsDirectives";
import Images from "./pages/UiElements/Images";
import ActividadesPanel from "./pages/UiElements/ActividadesPanel";
import BarChart from "./pages/Charts/BarChart";
import AnunciosList from "./pages/UiElements/AnunciosList";
import UsuariosPorTipo from "./pages/UiElements/UsuariosPorTipo";
import GruposList from "./pages/UiElements/GrupoList";
import AnalyticsDashboard from "./pages/UiElements/AnalyticsDashboard";

export default function DashboardRoutes() {
  const { usuario } = useUser();
  if (!usuario) return null;

  return (
    <Routes>
      <Route index element={<Home />} />

      {/* Ruta común para todos los tipos de usuario */}
      <Route path="profile" element={<UserProfiles />} />


      {/* Estudiante */}
      {usuario.tipo === "ESTUDIANTE" && (
        <>
          <Route path="calificaciones" element={<BasicTables />} />
          <Route path="asistencias" element={<AsistenciaPage />} />
          <Route path="actividades" element={<ActividadesPanelEstudent />} />
          <Route path="horarios" element={<Calendar />} />
          <Route path="anuncios" element={<AnunciosList />} />
          <Route path="estadisticas" element={<ChartsDashboard />} />
        </>
      )}

      {/* Docente */}
      {usuario.tipo === "DOCENTE" && (
        <>
          <Route path="clases" element={<Calendar />} />
          <Route path="actividades" element={<ActividadesPanel />} />
          <Route path="calificaciones" element={<BasicTableOneTeacher />} />
          <Route path="asistencias" element={<AsistenciaPage />} />
          <Route path="anuncios" element={<Avatars />} />
          {/* <Route path="reportes" element={<LineChart />} /> */}
          <Route path="estadisticas" element={<ChartsDashboard />} />
        </>
      )}

      {/* Administrativo */}
      {usuario.tipo === "ADMINISTRATIVO" && (
        <>
          <Route path="usuarios" element={<UsuariosPorTipo />} />
          <Route path="grupos" element={<GruposList />} />
          <Route path="analiticasusuarios" element={<AnalyticsDashboard />} />
          <Route path="anuncios" element={<Avatars />} />
          <Route path="reportes" element={<BarChart />} />
          <Route path="estadisticas" element={<ChartsDashboard />} />
        </>
      )}

      {/* Directivo */}
      {usuario.tipo === "DIRECTIVO" && (
        <>
          <Route path="escuelas" element={<SchoolsDirectives />} />
          <Route path="programas" element={<ManagementPrograms />} />
          <Route path="modulos" element={<Images />} />
          <Route path="anuncios" element={<Avatars />} />
          <Route path="estadisticas" element={<ChartsDashboard />} />
        </>
      )}
    </Routes>
  );
}
