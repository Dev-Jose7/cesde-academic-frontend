import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import CountryMap from "./CountryMap"; 

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const sedes = [
    { ciudad: "Cali", sedes: 1 },
    { ciudad: "Medellín", sedes: 1 },
    { ciudad: "Pereira", sedes: 1 },
    { ciudad: "Rionegro", sedes: 1 },
    { ciudad: "La Pintada", sedes: 1 },
    { ciudad: "Apartadó", sedes: 1 },
    { ciudad: "Bogotá", sedes: 1 },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Datos de escuelas Cesde
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Nuestro proyecto de crecimiento y expansión nos permite estar presentes en seis territorios claves para referenciarnos como un aliado clave de las empresas altamente productivas y conscientes de Antioquia y Colombia. Innovación, productividad, movilidad y saber aplicado, nos convierten en un referente del futuro de la educación.
          </p>
        </div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Ver más
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Borrar
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <div
          id="mapColombia"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-auto sm:-mx-6"
        >
          <CountryMap />
        </div>
      </div>


      <div className="space-y-5">
        {sedes.map((item) => (
          <div key={item.ciudad} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-xs">
                {item.ciudad[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                  {item.ciudad}
                </p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {item.sedes} Sede
                </span>
              </div>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div className="absolute left-0 top-0 h-full w-full rounded-sm bg-[#ec008c]"></div>
              </div>
              <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                100%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
