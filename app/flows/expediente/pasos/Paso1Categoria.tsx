"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { serviceCardsData } from "../../../lib/constants"; 
import { PasoProps } from "../expediente.types";
// Importamos todos los iconos que usas en tus tarjetas originales
import { 
  Home, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  Scale, 
  Flower2 
} from "lucide-react";

export function Paso1Categoria({ seleccion, setSeleccion, navegarPaso }: PasoProps) {
  
  /**
   * FUNCIÓN RECUPERADA: Renderiza el componente de Lucide basado en el nombre
   * y le aplica la clase de color específica (ej: text-emerald-500).
   */
  const renderIcon = (name: string, colorClass: string) => {
    const components: any = { 
      Home, 
      Users, 
      Briefcase, 
      ShieldCheck, 
      FileText, 
      MapPin,
      Scale,
      Flower2 // Por si usas el de derecho sucesoral/herencias
    };
    
    const Icon = components[name];
    
    // Si el icono existe en el diccionario, lo devuelve con su estilo
    return Icon ? <Icon className={`w-8 h-8 ${colorClass}`} /> : null;
  };

  return (
    <div className="w-full animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {serviceCardsData.map((card: any) => (
          <ServiceCard
            key={card.title}
            {...card}
            // PASO CLAVE: Pasamos el icono ya procesado a la ServiceCard
            icon={renderIcon(card.iconName, card.iconColor)}
            onClick={() => {
              setSeleccion({ ...seleccion, categoria: card.categoria });
              navegarPaso(2);
            }}
          />
        ))}
      </div>
    </div>
  );
}