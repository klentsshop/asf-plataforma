/**
 * Gestor de persistencia local para el flujo de expedientes.
 * Centraliza el acceso al almacenamiento del navegador para evitar colisiones.
 */
export const StorageCaso = {
  /**
   * Recupera el ID del caso actual para procesos de polling o vinculación.
   */
  getCasoId() {
    return typeof window !== "undefined" ? localStorage.getItem("asf_caso_id") : null;
  },

  /**
   * Guarda el ID generado por Sanity para mantener la sesión del expediente activa.
   */
  setCasoId(id: string) {
    localStorage.setItem("asf_caso_id", id);
  },

  /**
   * Limpia los datos temporales del caso una vez finalizado el registro oficial.
   */
  clearCaso() {
    localStorage.removeItem("asf_caso_id");
    localStorage.removeItem("asf_caso_activo_info");
  },

  /**
   * Almacena metadatos del caso activo para prevenir duplicados por rama y estado.
   */
  setCasoActivo(info: any) {
    localStorage.setItem("asf_caso_activo_info", JSON.stringify(info));
  },

  /**
   * Recupera la información del match actual (categoría + ubicación).
   */
  getCasoActivo() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("asf_caso_activo_info");
    return raw ? JSON.parse(raw) : null;
  },

  /**
   * Guarda el email del cliente para facilitar el acceso posterior a la bóveda.
   */
  setEmail(email: string) {
    localStorage.setItem("asf_cliente_email", email);
  }
};