import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import UpcomingClasses from "../../components/ecommerce/UpcomingClasses";
import NotificationsCard from "../../components/ecommerce/NotificationsCard";
import StudentProgressSummary from "../../components/ecommerce/StudentProgressSummary";
import QuickActions from "../../components/ecommerce/QuickActions";

export default function VistaDocente() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Columna izquierda */}
      <div className="col-span-12 xl:col-span-7 space-y-6">
        <EcommerceMetrics />
        <MonthlySalesChart />
        <StudentProgressSummary />
      </div>

      {/* Columna derecha */}
      <div className="col-span-12 xl:col-span-5 space-y-6">
        <h2 className="text-2xl font-bold text-[#ed2e91]">Panel exclusivo para docentes</h2>
        <UpcomingClasses />
        <NotificationsCard />
        <QuickActions />
      </div>
    </div>
  );
}
