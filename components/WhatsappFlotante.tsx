"use client";
import { useState, useEffect } from "react";

export function WhatsappFlotante() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 🕵️ Lógica de detección intacta:
    // Revisamos registro reciente (localStorage) o sesión activa (sessionStorage)
    const registroOk = localStorage.getItem("session_token");
    const sesionActiva = sessionStorage.getItem("asf_id");

    if (registroOk === "true" || sesionActiva) {
      setVisible(true);
    }
  }, []);

  // Si no hay rastro de cliente, el botón no existe en el DOM
  if (!visible) return null;

  return (
    <>
      {/* 🛠️ Carga externa de FontAwesome para el icono oficial */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
      />

      <a 
        href="https://wa.me/5804160443403?text=Hola,%20soy%20cliente%20registrado%20de%20TASF%20y%20necesito%20asistencia." 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 z-[9999] animate-bounce-subtle"
      >
        <i className="fa-brands fa-whatsapp text-4xl"></i>
      </a>

      {/* 🎨 Animación personalizada que no interfiere con Tailwind global */}
      <style jsx>{`
        .animate-bounce-subtle {
          animation: bounce-subtle 2.5s ease-in-out infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-7px) scale(1.03); }
        }
      `}</style>
    </>
  );
}