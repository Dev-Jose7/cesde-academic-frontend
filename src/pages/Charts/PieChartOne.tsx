import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartOneProps {
  dataObj: { [key: string]: number };
}

const COLORS_BG = [
  "rgba(237, 46, 145, 0.3)",  // rosado claro
  "rgba(255, 81, 118, 0.3)",  // coral claro
  "rgba(255, 124, 94, 0.3)",  // naranja claro
  "rgba(100, 149, 237, 0.3)", // azul claro
  "rgba(60, 179, 113, 0.3)",  // verde claro
];

const COLORS_BORDER = [
  "rgba(237, 46, 145, 0.8)",
  "rgba(255, 81, 118, 0.8)",
  "rgba(255, 124, 94, 0.8)",
  "rgba(100, 149, 237, 0.8)",
  "rgba(60, 179, 113, 0.8)",
];

const PieChartOne: React.FC<PieChartOneProps> = ({ dataObj }) => {
  const labels = Object.keys(dataObj);
  const dataValues = Object.values(dataObj);

  // Para asignar colores cíclicamente si hay más categorías que colores disponibles
  const backgroundColor = labels.map(
    (_, i) => COLORS_BG[i % COLORS_BG.length]
  );
  const borderColor = labels.map(
    (_, i) => COLORS_BORDER[i % COLORS_BORDER.length]
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Distribución",
        data: dataValues,
        backgroundColor,
        borderColor,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#555",
        },
      },
    },
  };

  return (
    <div className="max-w-sm mx-auto">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChartOne;
