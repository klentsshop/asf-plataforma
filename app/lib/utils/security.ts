export const filterSensitiveInfo = (text: string): { isSafe: boolean; cleanText: string } => {
  // 1. Normalización: Quitamos espacios, puntos, guiones y paréntesis solo para la validación
  // Esto hace que "3 2 0 5 6 7..." se convierta en "320567..."
  const normalizedText = text.replace(/[\s\.\-\(\),]/g, "");

  // 2. Definimos las reglas de prohibición
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  
  // PROHIBICIÓN RADICAL: Cualquier secuencia de 7 o más números seguidos es un teléfono.
  // Esto bloquea números de 7, 8, 9, 10, 11 o más dígitos sin importar el país.
  const phoneRegex = /\d{7,}/; 

  const hasEmail = emailRegex.test(text);
  const hasPhone = phoneRegex.test(normalizedText);

  return {
    isSafe: !hasEmail && !hasPhone,
    cleanText: text
      .replace(new RegExp(emailRegex, 'gi'), "[DATO BLOQUEADO]")
      .replace(/\d{4,}/g, "[DATO BLOQUEADO]") // Ofuscación visual para el historial
  };
};