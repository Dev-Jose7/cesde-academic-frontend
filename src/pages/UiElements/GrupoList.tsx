import React, { useEffect, useState } from "react";
import { fetchAuth } from "../../utils/fetchAuth";
import { FaUsers } from "react-icons/fa";

type Grupo = {
  id: number;
  codigo: string;
  programa: string;
  semestre: string;
  estado: string;
};

export default function GruposList() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [programaFiltro, setProgramaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  useEffect(() => {
    fetchAuth("/api/grupo/lista")
      .then(res => res.json())
      .then(data => setGrupos(data))
      .catch(error => console.error("Error al cargar grupos:", error));
  }, []);

  const programasUnicos = Array.from(new Set(grupos.map(g => g.programa)));
  const estadosUnicos = Array.from(new Set(grupos.map(g => g.estado)));

  const gruposFiltrados = grupos.filter(g =>
    (programaFiltro ? g.programa === programaFiltro : true) &&
    (estadoFiltro ? g.estado === estadoFiltro : true)
  );

  return React.createElement(
    "div",
    { className: "p-6" },
    React.createElement(
      "h2",
      { className: "text-2xl font-bold mb-4 flex items-center gap-2 text-[#ed2e91]" },
      React.createElement(FaUsers, { className: "text-[#ff5176]" }),
      "Listado de Grupos"
    ),
    React.createElement(
      "div",
      { className: "mb-4 flex gap-4 flex-wrap" },
      // Filtro por programa
      React.createElement("div", { className: "flex flex-col" },
        React.createElement("label", {
          className: "text-sm font-medium text-gray-600 mb-1",
          children: "Filtrar por programa",
        }),
        React.createElement("select", {
          className:
            "px-4 py-2 border rounded-lg focus:outline-none text-sm text-gray-700",
          value: programaFiltro,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
            setProgramaFiltro(e.target.value),
          children: [
            React.createElement("option", {
              key: "all-programas",
              value: "",
              children: "Todos los programas",
            }),
            ...programasUnicos.map(programa =>
              React.createElement("option", {
                key: programa,
                value: programa,
                children: programa,
              })
            ),
          ],
        })
      ),
      React.createElement("div", { className: "flex flex-col" },
        React.createElement("label", {
          className: "text-sm font-medium text-gray-600 mb-1",
          children: "Filtrar por estado",
        }),
        React.createElement("select", {
          className:
            "px-4 py-2 border rounded-lg focus:outline-none text-sm text-gray-700",
          value: estadoFiltro,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
            setEstadoFiltro(e.target.value),
          children: [
            React.createElement("option", {
              key: "all-estados",
              value: "",
              children: "Todos los estados",
            }),
            ...estadosUnicos.map(estado =>
              React.createElement("option", {
                key: estado,
                value: estado,
                children: estado,
              })
            ),
          ],
        })
      )
    ),
    React.createElement(
      "div",
      { className: "overflow-x-auto rounded-lg border border-gray-200" },
      React.createElement(
        "table",
        { className: "min-w-full bg-white text-sm text-gray-800" },
        React.createElement(
          "thead",
          { className: "bg-gray-800 text-white" },
          React.createElement(
            "tr",
            {},
            ["ID", "Código", "Programa", "Semestre", "Estado"].map(col =>
              React.createElement(
                "th",
                {
                  key: col,
                  className: "text-left px-4 py-3 whitespace-nowrap",
                },
                col
              )
            )
          )
        ),
        React.createElement(
          "tbody",
          {},
          gruposFiltrados.map(grupo =>
            React.createElement(
              "tr",
              { key: grupo.id, className: "border-t hover:bg-gray-50" },
              [
                grupo.id,
                grupo.codigo,
                grupo.programa,
                grupo.semestre,
                grupo.estado,
              ].map((val, i) =>
                React.createElement(
                  "td",
                  {
                    key: i,
                    className: "px-4 py-2 whitespace-nowrap",
                  },
                  val
                )
              )
            )
          )
        )
      )
    )
  );
}



