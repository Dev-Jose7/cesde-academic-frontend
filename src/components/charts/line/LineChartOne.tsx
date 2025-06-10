import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Actividad {
  id: number;
  titulo: string;
  tipo: string;
}

interface Calificacion {
  fecha: string; // ISO string
  nota: number;
  actividad: Actividad;
}

interface LineChartOneProps {
  data: Calificacion[];
}

export default function LineChartOne({ data }: LineChartOneProps) {
  const sortedData = data.slice().sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const categories = sortedData.map((item) =>
    new Date(item.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
  );

  const notas = sortedData.map((item) => item.nota);

  // Opcional: para mostrar el título de la actividad en el tooltip:
  const actividades = sortedData.map((item) => item.actividad.titulo);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: { curve: "straight", width: 2 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        return `<div style="padding:5px;">
          <strong>${actividades[dataPointIndex]}</strong><br/>
          Fecha: ${categories[dataPointIndex]}<br/>
          Nota: ${series[seriesIndex][dataPointIndex]}
        </div>`;
      },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: { style: { fontSize: "12px", colors: ["#6B7280"] } },
      title: { text: "", style: { fontSize: "0px" } },
    },
  };

  const series = [{ name: "Calificaciones", data: notas }];

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartLine" className="min-w-[1000px]">
        <Chart options={options} series={series} type="line" height={310} />
      </div>
    </div>
  );
}
