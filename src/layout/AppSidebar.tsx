import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CesdeLogo from "../assets/images/logo-Cesde-2023.svg";
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  ListIcon,
  PieChartIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useUser } from "../context/UserContext";

import "./AppSidebar.css";  // <-- Importa aquí tu CSS

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const getNavItemsByUserType = (tipo: string): NavItem[] => {
  switch (tipo) {
    case "ESTUDIANTE":
      return [
        {
          icon: <GridIcon />,
          name: "Dashboard",
          subItems: [{ name: "Inicio", path: "/dashboard/" }],
        },
        { icon: <TableIcon />, name: "Calificaciones", path: "/dashboard/calificaciones" },
        { icon: <ListIcon />, name: "Asistencias", path: "/dashboard/asistencias" },
        { icon: <UserCircleIcon />, name: "Actividades", path: "/dashboard/actividades" },
        { icon: <CalenderIcon />, name: "Horarios", path: "/dashboard/horarios" },
        { icon: <PieChartIcon />, name: "Anuncios", path: "/dashboard/anuncios" },
        { icon: <PieChartIcon />, name: "Estadísticas", path: "/dashboard/estadisticas" },
      ];
    case "DOCENTE":
      return [
        {
          icon: <GridIcon />,
          name: "Dashboard",
          subItems: [{ name: "Inicio", path: "/dashboard/" }],
        },
        { icon: <CalenderIcon />, name: "Clases", path: "/dashboard/clases" },
        { icon: <UserCircleIcon />, name: "Actividades", path: "/dashboard/actividades" },
        { icon: <TableIcon />, name: "Calificaciones", path: "/dashboard/calificaciones" },
        { icon: <ListIcon />, name: "Asistencias", path: "/dashboard/asistencias" },
        { icon: <PieChartIcon />, name: "Anuncios", path: "/dashboard/anuncios" },
        { icon: <PieChartIcon />, name: "Estadísticas", path: "/dashboard/estadisticas" },
      ];
    case "ADMINISTRATIVO":
      return [
        {
          icon: <GridIcon />,
          name: "Dashboard",
          subItems: [{ name: "Inicio", path: "/dashboard/" }],
        },
        { icon: <UserCircleIcon />, name: "Usuarios", path: "/dashboard/usuarios" },
        { icon: <ListIcon />, name: "Grupos", path: "/dashboard/grupos" },
        { icon: <CalenderIcon />, name: "Horario", path: "/dashboard/horario" },
        { icon: <TableIcon />, name: "Clase", path: "/dashboard/clase" },
        { icon: <PieChartIcon />, name: "Anuncios", path: "/dashboard/anuncios" },
        { icon: <PieChartIcon />, name: "Estadísticas", path: "/dashboard/estadisticas" },
      ];
    case "DIRECTIVO":
      return [
        {
          icon: <GridIcon />,
          name: "Dashboard",
          subItems: [{ name: "Inicio", path: "/dashboard/" }],
        },
        { icon: <UserCircleIcon />, name: "Escuelas", path: "/dashboard/escuelas" },
        { icon: <TableIcon />, name: "Programas", path: "/dashboard/programas" },
        { icon: <ListIcon />, name: "Módulos", path: "/dashboard/modulos" },
        { icon: <PieChartIcon />, name: "Anuncios", path: "/dashboard/anuncios" },
        { icon: <PieChartIcon />, name: "Reportes", path: "/dashboard/reportes" },
        { icon: <PieChartIcon />, name: "Estadísticas", path: "/dashboard/estadisticas" },
      ];
    default:
      return [];
  }
};

const AppSidebar: React.FC = () => {
  const { usuario } = useUser();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const navItems = usuario ? getNavItemsByUserType(usuario.tipo) : [];

  const [openSubmenu, setOpenSubmenu] = useState<{ type: string; index: number } | null>(null);

  const isActive = (path: string) => location.pathname === path;

  const handleSubmenuToggle = (index: number, menuType: string) => {
    setOpenSubmenu((prev) =>
      prev?.index === index && prev?.type === menuType ? null : { index, type: menuType }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: string) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name} className="relative">
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`flex items-center w-full cursor-pointer gap-2 px-3 py-2 rounded-md 
                ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                } 
                ${!isExpanded && !isHovered ? "justify-center" : "justify-start"}`}
              >
                <span
                  className={`text-xl ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "text-[#ed2e91] dark:text-[#b0216f]"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="flex-1 text-left">{nav.name}</span>
                    <span
                      className={`transition-transform duration-200 ${
                        openSubmenu?.type === menuType && openSubmenu?.index === index
                          ? "rotate-180"
                          : ""
                      }`}
                    >
                      <ChevronDownIcon />
                    </span>
                  </>
                )}
              </button>

              {/* Submenu */}
              {openSubmenu?.type === menuType && openSubmenu?.index === index && (
                <ul className="ml-8 mt-1 flex flex-col gap-1">
                  {nav.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        to={sub.path}
                        className={`block px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700
                          ${
                            isActive(sub.path)
                              ? "bg-corporate-pink text-white dark:bg-corporate-pink-dark"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : nav.path ? (
            <Link
              to={nav.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md
                ${
                  isActive(nav.path)
                    ? "bg-corporate-pink text-white dark:bg-corporate-pink-dark"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }
                ${!isExpanded && !isHovered ? "justify-center" : "justify-start"}`}
            >
              <span className="text-xl">{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && <span>{nav.name}</span>}
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to="/dashboard" className="flex items-center justify-center pt-10">
        <img src={CesdeLogo} alt="Logo" className="h-14" />
      </Link>
      <nav
        className={`mt-6 space-y-6 overflow-y-auto flex-1 pb-8 ${
          isExpanded || isMobileOpen || isHovered ? "" : "items-center"
        }`}
      >
        {renderMenuItems(navItems, "main")}
      </nav>
    </aside>
  );
};

export default AppSidebar;


