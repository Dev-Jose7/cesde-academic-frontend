import React from "react";
import LineaTransparencia from "../../components/ecommerce/LineaTransparencia";
import RutaEmprendimiento from "../../components/ecommerce/RutaEmprendimiento";
import AccesoPlatzi from "../../components/ecommerce/AccesoPlatzi";
import PanelInformativo from "../../components/ecommerce/PanelInformativo";
import CronogramaAcademico from "../../components/ecommerce/CronogramaAcademico";
import PanelImagen from "../../components/ecommerce/PanelImagen";

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-pink-600 cursor-default"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 7h6m0 0v6m0-6L10 16"
    />
  </svg>
);

const VistaEstudiante: React.FC = () => {
  return (
    <div className="home-page px-6 py-8">
      {/* Header de bienvenida */}
      <div className="welcome-header mb-6 flex items-center justify-center gap-3">
        <i className="bi bi-mortarboard-fill text-2xl text-pink-600"></i>
        <h2 className="text-2xl font-semibold">¡Bienvenido al CESDE!</h2>
      </div>

      {/* Video y links */}
      <div className="grid grid-cols-1 md:grid-cols-[800px_1fr] gap-8 items-start">
        <div
          style={{
            width: 800,
            height: 450,
            maxWidth: "100%",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow:
              "0 4px 10px rgb(0 0 0 / 0.1), 0 2px 6px rgb(0 0 0 / 0.06)",
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/Yj1PcEq5Oxo"
            title="Bienvenida CESDE"
            allowFullScreen
            style={{ border: "none" }}
          ></iframe>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <LineaTransparencia />
            <div className="ml-2 p-1">
              <ExternalLinkIcon />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <RutaEmprendimiento />
            <div className="ml-2 p-1">
              <ExternalLinkIcon />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <AccesoPlatzi />
            <div className="ml-2 p-1">
              <ExternalLinkIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Panel informativo y cronograma */}
      <div className="mt-12 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2">
          <CronogramaAcademico />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <PanelInformativo />
          <PanelImagen />
        </div>
      </div>
    </div>
  );
};

export default VistaEstudiante;

