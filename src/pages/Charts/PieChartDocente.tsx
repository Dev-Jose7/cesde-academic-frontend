import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import React from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartDocenteProps {
  dataObj: { [key: string]: number };
}

const COLORS_BG = [
  'rgba(100, 149, 237, 0.3)', // Azul claro
  'rgba(255, 99, 132, 0.3)',  // Rojo claro
  'rgba(54, 162, 235, 0.3)',  // Azul
];
const COLORS_BORDER = [
  'rgba(100, 149, 237, 0.8)', // Azul claro
  'rgba(255, 99, 132, 0.8)',  // Rojo claro
  'rgba(54, 162, 235, 0.8)',  // Azul
];

const PieChartDocente: React.FC<PieChartDocenteProps> = ({ dataObj }) => {
  const labels = Object.keys(dataObj);
  const dataValues = Object.values(dataObj);

  const backgroundColor = labels.map((_, i) => COLORS_BG[i % COLORS_BG.length]);
  const borderColor = labels.map((_, i) => COLORS_BORDER[i % COLORS_BORDER.length]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Distribución',
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
        position: 'right' as const,
        labels: { color: '#555' },
      },
    },
  };

  return (
    <div className="max-w-sm mx-auto">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChartDocente;
