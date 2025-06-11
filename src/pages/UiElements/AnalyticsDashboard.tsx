import React, { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Modelo de usuario
interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  tipo: string;
  estado: string;
  creado: string;
  actualizado: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    fetchAuth("/api/usuario/lista")
      .then(res => res.json())
      .then(setUsuarios)
      .catch(console.error);
  }, []);

  const estadosCount = usuarios.reduce((acc, u) => {
    acc[u.estado] = (acc[u.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const estadosData = {
    labels: Object.keys(estadosCount),
    datasets: [{
      label: "Usuarios por estado",
      data: Object.values(estadosCount),
      backgroundColor: ["#ed2e9180", "#ff517680", "#ff7c5e80", "#ffa85080"]
    }]
  };

  const tipoCount = usuarios.reduce((acc, u) => {
    acc[u.tipo] = (acc[u.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tipoData = {
    labels: Object.keys(tipoCount),
    datasets: [{
      label: "Distribución por tipo",
      data: Object.values(tipoCount),
      backgroundColor: ["#ed2e9180", "#ff517680", "#ff7c5e80"]
    }]
  };

  const mesCount = usuarios.reduce((acc, u) => {
    const mes = new Date(u.creado).toLocaleDateString("es-CO", { year: "numeric", month: "short" });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mesData = {
    labels: Object.keys(mesCount),
    datasets: [{
      label: "Usuarios creados por mes",
      data: Object.values(mesCount),
      borderColor: "#ed2e91",
      backgroundColor: "rgba(237,46,145,0.2)",
      fill: true
    }]
  };

  const doughnutData = { ...estadosData };

  const total = usuarios.length;
  const graduados = estadosCount["GRADUADO"] || 0;
  const eliminados = estadosCount["ELIMINADO"] || 0;
  const suspendidos = estadosCount["SUSPENDIDO"] || 0;

  return (
    <div className="p-6 bg-white rounded shadow-md text-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Análisis y Estrategias</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded p-4 shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-600 text-sm">Usuarios por Estado</h3>
          <div className="h-60">
            <Pie data={estadosData} />
          </div>
        </div>

        <div className="bg-gray-50 rounded p-4 shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-600 text-sm">Tipos de Usuario</h3>
          <div className="h-60">
            <Bar data={tipoData} />
          </div>
        </div>

        <div className="bg-gray-50 rounded p-4 shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-600 text-sm">Tendencia Mensual</h3>
          <div className="h-60">
            <Line data={mesData} />
          </div>
        </div>

        <div className="bg-gray-50 rounded p-4 shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-600 text-sm">Distribución Alternativa</h3>
          <div className="h-60">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded shadow-sm">
        <p>✅ <strong>{graduados}</strong> estudiantes graduados: excelente índice de finalización.</p>
        {eliminados > suspendidos ? (
          <p>⚠️ Más eliminados (<strong>{eliminados}</strong>) que suspendidos (<strong>{suspendidos}</strong>). Revisa políticas de retención.</p>
        ) : (
          <p>🔎 Más suspendidos (<strong>{suspendidos}</strong>) que eliminados (<strong>{eliminados}</strong>): gestión disciplinaria activa.</p>
        )}
        {total < 10 ? (
          <p>📉 Total bajo de usuarios (<strong>{total}</strong>). Considera campañas de captación.</p>
        ) : (
          <p>📈 Base sólida con <strong>{total}</strong> usuarios. ¡Sigue fortaleciendo el compromiso!</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;






