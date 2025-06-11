import React, { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";
import CrearUsuario from "./CrearUsuario";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaUserSlash,
} from "react-icons/fa";

type Usuario = {
  id: number;
  cedula: string;
  nombre: string;
  tipo: string;
  estado: string;
  creado: string;
  actualizado: string;
};

const colores = {
  ESTUDIANTE: "#ed2e91",
  DOCENTE: "#ff5176",
  ADMINISTRATIVO: "#ff7c5e",
  DIRECTIVO: "#ff7c5e",
  OTRO: "#ccc",
};

const tipoIcono: Record<string, React.ReactElement> = {
  ESTUDIANTE: React.createElement(FaUserGraduate, { size: 20, color: colores.ESTUDIANTE }),
  DOCENTE: React.createElement(FaChalkboardTeacher, { size: 20, color: colores.DOCENTE }),
  ADMINISTRATIVO: React.createElement(FaUserTie, { size: 20, color: colores.ADMINISTRATIVO }),
  DIRECTIVO: React.createElement(FaUserTie, { size: 20, color: colores.DIRECTIVO }),
  OTRO: React.createElement(FaUserSlash, { size: 20, color: colores.OTRO }),
};

const UsuariosPorTipo: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [agrupados, setAgrupados] = useState<Record<string, Usuario[]>>({});

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await fetchAuth("/api/usuario/lista");
        const data: Usuario[] = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    obtenerUsuarios();
  }, []);

  useEffect(() => {
    const agrupadosPorTipo: Record<string, Usuario[]> = {};
    usuarios.forEach((usuario) => {
      const tipo = usuario.tipo || "OTRO";
      if (!agrupadosPorTipo[tipo]) {
        agrupadosPorTipo[tipo] = [];
      }
      agrupadosPorTipo[tipo].push(usuario);
    });
    setAgrupados(agrupadosPorTipo);
  }, [usuarios]);

  return React.createElement("div", { className: "space-y-8" }, [
    React.createElement(CrearUsuario, { key: "crear-usuario" }),

    React.createElement(
      "div",
      {
        key: "panel-usuarios",
        className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4",
      },
      Object.entries(agrupados).map(([tipo, lista]) =>
        React.createElement(
          "div",
          {
            key: tipo,
            className: "bg-white rounded-2xl shadow-md p-4 border border-gray-100",
          },
          [
            React.createElement(
              "div",
              {
                className: "flex items-center justify-between mb-4",
              },
              [
                React.createElement(
                  "div",
                  {
                    className: "flex items-center gap-2",
                  },
                  [
                    tipoIcono[tipo] || tipoIcono["OTRO"],
                    React.createElement(
                      "h2",
                      {
                        className: "text-lg font-semibold text-gray-800",
                      },
                      tipo
                    ),
                  ]
                ),
                React.createElement(
                  "span",
                  {
                    className: "text-sm font-medium text-gray-500",
                  },
                  `${lista.length} usuario${lista.length > 1 ? "s" : ""}`
                ),
              ]
            ),
            React.createElement(
              "ul",
              { className: "space-y-2" },
              lista.map((usuario) =>
                React.createElement(
                  "li",
                  {
                    key: usuario.id,
                    className:
                      "border border-gray-200 rounded-lg p-3 text-sm text-gray-700 hover:bg-gray-50 transition",
                  },
                  [
                    React.createElement(
                      "div",
                      { className: "font-semibold" },
                      usuario.nombre
                    ),
                    React.createElement(
                      "div",
                      { className: "text-xs text-gray-500" },
                      `Cédula: ${usuario.cedula}`
                    ),
                    React.createElement(
                      "div",
                      { className: "text-xs text-gray-500" },
                      `Estado: ${usuario.estado}`
                    ),
                  ]
                )
              )
            ),
          ]
        )
      )
    ),
  ]);
};

export default UsuariosPorTipo;
