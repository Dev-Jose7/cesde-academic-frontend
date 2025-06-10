import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface LineChartDocenteProps {
  data: { estudianteId: number; cantidad_inasistencias: number }[];
}

export default function LineChartDocente({ data }: LineChartDocenteProps) {
  const categorias = data.map((item) => `Est. ${item.estudianteId}`);
  const valores = data.map((item) => item.cantidad_inasistencias);

  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "Outfit, sans-serif",
      height: 310,
      toolbar: { show: false },
    },
    colors: ["#465FFF"],
    stroke: { curve: "straight", width: 2 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 4,
      hover: { size: 6 },
    },
    xaxis: {
      categories: categorias, // ← CORREGIDO
      title: { text: "Estudiantes" },
    },
    yaxis: {
      title: { text: "Inasistencias" },
      min: 0,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} inasistencias`,
      },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
  };

  const series = [
    {
      name: "Inasistencias",
      data: valores,
    },
  ];

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="lineChartDocente" className="min-w-[1000px]">
        <Chart options={options} series={series} type="line" height={310} />
      </div>
    </div>
  );
}
