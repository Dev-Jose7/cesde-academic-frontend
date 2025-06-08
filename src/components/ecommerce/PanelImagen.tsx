import React from "react";
import cesdeBanner from "../../assets/images/cesdebanner.jpg"; 

const PanelImagen: React.FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 mt-4 h-98">
    <img
        src={cesdeBanner}
        alt="Imagen informativa"
        className="w-full h-full object-cover"
    />
    </div>
  );
};

export default PanelImagen;