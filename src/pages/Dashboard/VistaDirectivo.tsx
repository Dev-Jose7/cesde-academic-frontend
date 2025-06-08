import React from "react";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import RecentOrders from "../../components/ecommerce/RecentOrders";

export default function VistaDirectivo() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-6 flex flex-col gap-4">
        <MonthlyTarget />
        <RecentOrders />
      </div>
      <div className="col-span-12 xl:col-span-6">
        <DemographicCard />
      </div>
      <p className="col-span-12 text-lg">Panel estratégico para directivos</p>
    </div>
  );
}
