import React from "react";
import { GraduationCap, BookOpen, MessageCircle } from "lucide-react";

const PanelInformativo: React.FC = () => {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-gray-50 to-white shadow-md border border-gray-200 p-6">
      <div className="space-y-6 text-[15px] text-gray-700">
        {/* Comfama */}
        <div className="flex items-start gap-4 bg-gray-100 rounded-lg p-4 hover:shadow-sm transition">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#ed2e91] text-white aspect-square shrink-0">
            <GraduationCap size={20} />
          </div>
          <p className="leading-relaxed">
            Con el crédito <span className="font-semibold text-gray-800">Comfama</span> puedes financiar hasta el{" "}
            <span className="font-semibold text-gray-800">100%</span> de los contenidos educativos de CESDE, con descuentos y tasas de interés especiales. Esta opción aplica para afiliados y no afiliados.
          </p>
        </div>

        {/* eCesde */}
        <div className="flex items-start gap-4 bg-gray-100 rounded-lg p-4 hover:shadow-sm transition">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#ed2e91] text-white aspect-square shrink-0">
            <BookOpen size={20} />
          </div>
          <p className="leading-relaxed">
            <span className="font-semibold text-gray-800">eCesde</span>: Son cursos de habilidades blandas para la vida y para el trabajo. Todos son digitales, certificables y el portafolio crece según las necesidades de los estudiantes y del mercado.
          </p>
        </div>

        {/* WhatsApp */}
        <div className="flex items-start gap-4 bg-gray-100 rounded-lg p-4 hover:shadow-sm transition">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#ed2e91] text-white aspect-square shrink-0">
            <MessageCircle size={20} />
          </div>
          <p className="leading-relaxed">
            ¿Necesitas ayuda?{" "}
            <a
              href="https://api.whatsapp.com/send?phone=573108817325"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#ed2e91] hover:underline"
            >
              Haz clic aquí para hablar por WhatsApp.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PanelInformativo;


