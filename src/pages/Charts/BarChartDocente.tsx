import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface NotaDocente {
  estudianteId: number;
  promedio_nota: number;
}

interface InasistenciaDocente {
  estudianteId: number;
  cantidad_inasistencias: number;
}

interface BarChartDocenteProps {
  data: NotaDocente[] | InasistenciaDocente[];
  tipo: "notas" | "inasistencias";
}

export default function BarChartDocente({ data, tipo }: BarChartDocenteProps) {
  const categorias = data.map((item) => `Est. ${item.estudianteId}`);
  const valores =
    tipo === "notas"
      ? (data as NotaDocente[]).map((item) => parseFloat(item.promedio_nota.toFixed(2)))
      : (data as InasistenciaDocente[]).map((item) => item.cantidad_inasistencias);

  const yAxisTitle = tipo === "notas" ? "Nota Promedio" : "Inasistencias";

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 250,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categorias,
      labels: {
        rotate: -45,
        style: { fontSize: "10px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: yAxisTitle },
      min: 0,
      max: tipo === "notas" ? 5 : undefined,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
    fill: { opacity: 1 },
  };

  const series = [
    {
      name: yAxisTitle,
      data: valores,
    },
  ];

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartDocente" className="min-w-[1000px]">
        <Chart options={options} series={series} type="bar" height={250} />
      </div>
    </div>
  );
}
