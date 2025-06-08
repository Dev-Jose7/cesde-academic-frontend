import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import StudentStats from "../../components/ecommerce/StudentStats";
import EnrollmentTypes from "../../components/ecommerce/EnrollmentTypes";
import CourseTypes  from "../../components/ecommerce/CourseTypes";
import TeacherInfo  from "../../components/ecommerce/TeacherInfo";
import AverageGrades from "../../components/ecommerce/AverageGrades";
import Notifications from "../../components/ecommerce/Notifications";

export default function VistaAdministrativo() {
  return (
    <div className="p-4 grid grid-cols-12 gap-6 bg-gray-50">

      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white p-4 rounded-xl shadow-md h-full">
          <StatisticsChart />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <div className="bg-white p-4 rounded-xl shadow-md h-full">
          <Notifications />
        </div>
      </div>

      <div className="col-span-12 md:col-span-6">
        <div className="bg-white p-4 rounded-xl shadow-md h-full">
          <StudentStats />
        </div>
      </div>
      <div className="col-span-12 md:col-span-6">
        <div className="bg-white p-4 rounded-xl shadow-md h-full">
          <EnrollmentTypes />
        </div>
      </div>

      <div className="col-span-12 md:col-span-6">
        <div className="bg-white p-4 rounded-xl shadow-md h-full flex flex-col gap-4">
          <AverageGrades />
          <CourseTypes />
          <TeacherInfo />
        </div>
      </div>
      <div className="col-span-12 md:col-span-6">
        <div className="bg-white p-4 rounded-xl shadow-md h-full">
          <RecentOrders />
        </div>
      </div>

      {/* Footer */}
      <div className="col-span-12">
        <p className="text-center text-sm text-gray-500">
          Vista para administrativos - control y seguimiento
        </p>
      </div>
    </div>
  );
}


