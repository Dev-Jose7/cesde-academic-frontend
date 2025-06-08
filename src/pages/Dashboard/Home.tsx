// src/pages/Dashboard/Home.tsx
import React from "react";
import PageMeta from "../../components/common/PageMeta";
import { useUser } from "../../context/UserContext";
import VistaEstudiante from "./VistaEstudiante";
import VistaDocente from "./VistaDocente";
import VistaAdministrativo from "./VistaAdministrativo";
import VistaDirectivo from "./VistaDirectivo";
import "../../index.css";
import "./Home.css";

export default function Home() {
  const { usuario } = useUser();

  if (!usuario) {
    return <div>Cargando usuario...</div>;
  }

  return (
    <>
      <PageMeta
        title="Dashboard | CesdeAcademic"
        description="Panel de control principal de CesdeAcademic"
      />

      <h1 className="text-2xl font-bold mb-4">Bienvenido, {usuario.nombre}</h1>

      {usuario.tipo === "ESTUDIANTE" && <VistaEstudiante />}
      {usuario.tipo === "DOCENTE" && <VistaDocente />}
      {usuario.tipo === "ADMINISTRATIVO" && <VistaAdministrativo />}
      {usuario.tipo === "DIRECTIVO" && <VistaDirectivo />}
    </>
  );
}