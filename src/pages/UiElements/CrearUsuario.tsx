import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";

const CrearUsuario = () =>
  React.createElement(
    "div",
    {
      className:
        "w-full px-8 py-6 bg-white rounded-2xl shadow-lg space-y-6 md:col-span-2",
    },
    React.createElement(
      "h2",
      {
        className: "text-2xl font-bold text-[#ed2e91] flex items-center gap-2",
      },
      React.createElement(FaUserPlus, { className: "text-[#ff5176]" }),
      "Crear Usuario"
    ),
    React.createElement(
      "form",
      {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
      },
      // Nombre completo
      React.createElement(
        "div",
        { className: "flex flex-col" },
        React.createElement("label", { className: "text-sm font-medium" }, "Nombre Completo"),
        React.createElement("input", {
          type: "text",
          placeholder: "Ej: Laura Torres Vanegas",
          className:
            "mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7c5e]",
        })
      ),
      React.createElement(
        "div",
        { className: "flex flex-col" },
        React.createElement("label", { className: "text-sm font-medium" }, "Cédula"),
        React.createElement("input", {
          type: "text",
          placeholder: "Ej: 1034543213",
          className:
            "mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7c5e]",
        })
      ),
      React.createElement(
        "div",
        { className: "flex flex-col md:col-span-2" },
        React.createElement("label", { className: "text-sm font-medium" }, "Correo Electrónico"),
        React.createElement("input", {
          type: "email",
          placeholder: "Ej: correo@ejemplo.com",
          className:
            "mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7c5e]",
        })
      ),
      React.createElement(
        "div",
        { className: "flex flex-col" },
        React.createElement("label", { className: "text-sm font-medium" }, "Contraseña"),
        React.createElement("input", {
          type: "password",
          placeholder: "••••••••",
          className:
            "mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7c5e]",
        })
      ),
      React.createElement(
        "div",
        { className: "flex flex-col" },
        React.createElement("label", { className: "text-sm font-medium" }, "Tipo de Usuario"),
        React.createElement(
          "select",
          {
            className:
              "mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7c5e]",
          },
          React.createElement("option", {}, "Seleccione una opción"),
          React.createElement("option", {}, "Estudiante"),
          React.createElement("option", {}, "Docente"),
          React.createElement("option", {}, "Administrativo"),
          React.createElement("option", {}, "Directivo")
        )
      ),
      React.createElement(
        "div",
        { className: "md:col-span-2" },
        React.createElement(
          "button",
          {
            type: "submit",
            className:
              "w-full bg-[#ed2e91] text-white py-2 px-4 rounded-md hover:bg-[#ff5176] transition",
          },
          "Crear Usuario"
        )
      )
    )
  );

export default CrearUsuario;

