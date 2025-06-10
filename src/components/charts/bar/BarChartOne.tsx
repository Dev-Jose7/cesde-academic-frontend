import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type Calificacion = {
  nota: number;
  actividad: {
    titulo: string;
  };
};

type AsistenciaObj = {
  [fecha: string]: number;
};

interface BarChartOneProps {
  data: Calificacion[] | AsistenciaObj;
}

export default function BarChartOne({ data }: BarChartOneProps) {
  let categorias: string[] = [];
  let valores: number[] = [];
  let yAxisTitle = "";

  if (Array.isArray(data)) {
    // Es arreglo de calificaciones
    categorias = data.map((item) => item.actividad.titulo);
    valores = data.map((item) => parseFloat(item.nota.toFixed(2)));
    yAxisTitle = "Nota";
  } else if (typeof data === "object" && data !== null) {
    // Es objeto de asistencias tipo { "2025-06-10": 1, ... }
    categorias = Object.keys(data);
    valores = Object.values(data);
    yAxisTitle = "Asistencia";
  }

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categorias,
      labels: {
        rotate: -45,
        style: {
          fontSize: "10px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: yAxisTitle,
      },
      min: 0,
      max: yAxisTitle === "Nota" ? 5 : undefined,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: yAxisTitle,
      data: valores,
    },
  ];

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartOne">
        <Chart options={options} series={series} type="bar" height={180} />
      </div>
    </div>
  );
}