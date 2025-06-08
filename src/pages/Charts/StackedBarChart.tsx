import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StackedBarChart() {
  useEffect(() => {
    const fetchData = async () => {
      const usuario = localStorage.getItem("usuario");
      if (!usuario) return;

      const id = JSON.parse(usuario).id;
      try {
        const response = await fetch(
          `https://cesde-academic-analytics-production.up.railway.app/estudiantes/${id}/asistencias`
        );
        const data = await response.json();
        console.log("Datos asistencias:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Ventas Producto A",
        data: [30, 20, 50, 40, 60, 70],
        backgroundColor: "rgba(237, 46, 145, 0.3)", // rosado claro
      },
      {
        label: "Ventas Producto B",
        data: [20, 30, 40, 30, 50, 60],
        backgroundColor: "rgba(255, 81, 118, 0.3)", // coral claro
      },
      {
        label: "Ventas Producto C",
        data: [10, 20, 30, 20, 40, 50],
        backgroundColor: "rgba(255, 124, 94, 0.3)", // naranja claro
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#222222",
          font: {
            weight: 600,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: "#222222",
          font: {
            weight: 600,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: "#222222",
          font: {
            weight: 600,
          },
        },
        grid: {
          color: "rgba(0,0,0,0.1)",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}




