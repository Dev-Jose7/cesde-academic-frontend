import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartOne = () => {
  const data = {
    labels: ["Aprobado", "Reprobado", "En Proceso"],
    datasets: [
      {
        label: "Distribución",
        data: [55, 30, 15],
        backgroundColor: [
          "rgba(237, 46, 145, 0.3)",  // rosado claro con transparencia
          "rgba(255, 81, 118, 0.3)",  // coral claro con transparencia
          "rgba(255, 124, 94, 0.3)",  // naranja claro con transparencia
        ],
        borderColor: [
          "rgba(237, 46, 145, 0.8)",
          "rgba(255, 81, 118, 0.8)",
          "rgba(255, 124, 94, 0.8)",
        ],
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


