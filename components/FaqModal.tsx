"use client";
import { X, HelpCircle, ShieldCheck } from "lucide-react";

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FaqModal({ isOpen, onClose }: FaqModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[10000] animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border-4 border-[#D4AF37]">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h3 className="text-2xl font-black text-[#D4AF37] italic uppercase tracking-tighter">Términos y Condiciones</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tu Abogado Sin Fronteras •Legal</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="space-y-4 overflow-y-auto pr-4 custom-scrollbar text-center">
          {/* SECCIÓN LEGAL (Transcripción íntegra) */}
          <section className="text-center">    
            <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 font-serif text-[13px] md:text-[14px] text-slate-700 leading-relaxed space-y-6">
              
              <h5 className="font-black text-center text-[#00244C] border-b pb-2 uppercase tracking-tighter">TÉRMINOS Y CONDICIONES DE "TU ABOGADO SIN FRONTERAS"</h5>

              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[11px] mb-1">1. OBJETO</p>
                <p>"Tu Abogado Sin Fronteras" es una plataforma digital destinada a facilitar la conexión, interacción y comunicación entre profesionales del derecho debidamente colegiados, calificados y autorizados para ejercer en la República Bolivariana de Venezuela; y usuarios, clientes o interesados ubicados dentro o fuera del territorio nacional que requieran asistencia, asesoría o representación en materia jurídica en Venezuela.</p>
              </div>

              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[11px] mb-1">2. USUARIOS</p>
                <p><strong>Clientes:</strong> Personas que solicitan servicios legales en Venezuela, a través de la plataforma, sin importar su ubicación geográfica.</p>
                <p><strong>Abogados:</strong> Profesionales autorizados y residentes en Venezuela, que aceptan casos y ofrecen sus servicios mediante esta plataforma.</p>
              </div>

              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[11px] mb-1">3. REGISTRO Y USO</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>El acceso a la plataforma requiere registro previo de todos los usuarios.</li>
                  <li>Para mantenerse informados del avance de los casos que le competen, deberán ingresar al respectivo panel con su usuario y contraseña, la cual será enviada automáticamente desde el dominio oficial: @tuabogadosinfronteras.com-gestion@tuabogadosinfronteras.com al correo insertado al registrarse en la plataforma.</li>
                  <li>Sus contraseñas son privadas y "Tu Abogado Sin Fronteras" nunca le solicitará dicha información.</li>
                  <li>Cada usuario es responsable de mantener la confidencialidad de sus datos y credenciales.</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[11px] mb-1">4. PRESTACIÓN DE SERVICIOS Y COMUNICACIÓN</p>
                <div className="space-y-3">
                  <p>• Los clientes podrán deslizar las tarjetas de servicios jurídicos para ubicar en cual de ellas se puede resolver su caso, haciendo clic en "consulta gratis", seleccionando luego, el estado de Venezuela donde se debe resolver la situación legal; seguido de ello, deberán indicar a través de texto o audio, los detalles que aporten información relevante, orientada a una asesoría asertiva por parte del abogado del equipo TASF "Tu Abogado Sin Fronteras", a quien se le asigne y analice el caso; el cliente podrá visualizar su respuesta a la consulta realizada, haciendo clic en la campanita dorada.</p>
                  <p>• Los abogados ofrecerán sus servicios, aceptando y analizando los casos asignados de forma automática por la plataforma, conforme a su especialidad y residencia; la comunicación e información de todos los casos ingresados por "Tu Abogado Sin Fronteras", desde el inicio hasta su conclusión y entrega, será estrictamente a través de esta plataforma; los abogados no están autorizados por la administración TASF a solicitar, recibir o entregar información de casos exclusivos de "Tu Abogado Sin Fronteras" por fuera de ésta, garantizando la seguridad y protección de los usuarios de esta plataforma.</p>
                  <p>• La plataforma facilita la comunicación y gestión para la resolución de los casos jurídicos, siendo éste el único medio de intercambio de información necesaria para la prosecución del proceso, pero no participa directamente en la relación profesional entre abogado y cliente; sin embargo, queda prohibido el intercambio de información de contacto entre abogado/cliente, como: número de teléfono, dirección de correo electrónico, dirección de domicilio, redes sociales, entre otros medios de comunicación.</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[11px] mb-1">5. PAGOS Y GARANTÍAS</p>
                <div className="space-y-3">
                  <p><strong>5.1 Forma y condiciones de pago:</strong> Los pagos por los servicios profesionales, deben realizarse exclusivamente a las cuentas bancarias proporcionadas automáticamente por la plataforma.</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Al solicitar un servicio y ser analizado por un abogado del equipo TASF, el cliente recibirá un correo electrónico con los datos de cuentas bancarias autorizadas, enviado desde el dominio oficial: @tuabogadosinfronteras.com.</li>
                    <li>Es responsabilidad exclusiva del cliente verificar que el correo provenga de dicho dominio, antes de efectuar cualquier transferencia o pago.</li>
                    <li>La plataforma no se responsabiliza por pagos realizados a cuentas distintas a las autorizadas, ni por instrucciones en relación a pagos, recibidas directamente de abogados.</li>
                    <li>Los abogados no están autorizados a recibir pagos directos de los clientes, siendo la administración de la plataforma la única encargada de recibir los pagos de los clientes y de liberar posteriormente el pago a los abogados por sus honorarios en el tiempo establecido.</li>
                    <li>Una vez recibido y validado el pago por la administración de esta plataforma, se cambiará automáticamente la fase o estado del caso, tanto en el panel del cliente, como en el panel profesional del abogado que aceptó y analizó el caso, dando inicio al proceso para la resolución de la situación jurídica en cuestión.</li>
                  </ul>
                  <p><strong>5.2 Envío de datos bancarios por parte de los abogados:</strong> Los abogados que acepten y resuelvan casos asignados por esta plataforma, deberán diligenciar los datos de su cuenta bancaria personal, única y exclusivamente en su panel profesional.</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Esta información será utilizada por la plataforma únicamente para realizar el pago correspondiente por los servicios profesionales prestados.</li>
                    </ul>
                  <p><strong>5.3 Custodia y liberación de fondos:</strong> Los pagos efectuados por los clientes, quedarán retenidos en la cuenta de la plataforma en calidad de depósito como garantía, hasta la conclusión y entrega del trabajo final relacionado con el caso.</p>
                   <ul className="list-disc pl-4 space-y-1">
                    <li>Una vez entregado el servicio y validada su conformidad por parte del cliente, la plataforma procederá a liberar el pago correspondiente a los honorarios del abogado.</li>
                    </ul>
                    <p><strong>5.4 Responsabilidad de los usuarios:</strong> La plataforma no exime ni libera a abogados, ni a clientes de su responsabilidad, en relación con actos irregulares, incumplimiento de reglas internas e infracción de leyes reguladoras del uso de la tecnología y/o comisión de delitos electrónicos.</p>
                   <ul className="list-disc pl-4 space-y-1">
                    <li>Cada usuario es responsable del correcto y adecuado uso de la plataforma, así como del cumplimiento de estos términos y condiciones.</li>
                    </ul>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[11px] mb-1 text-red-800">6. SANCIONES</p>
                <p>Las faltas u omisiones del buen manejo de la plataforma por parte de cualquiera de los usuarios, acarrearán sanciones internas de acuerdo al caso, pudiendo quedar bloqueado o expulsado de la plataforma, reservandose ésta el derecho de admisión, garantizando así la seguridad del resto de los usuarios.</p>
              </div>

              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[11px] mb-1">7. CONFIDENCIALIDAD</p>
                <div className="space-y-3">
                  <p>Los datos y documentos compartidos serán tratados con estricta confidencialidad, conforme a la normativa aplicable, garantizando la protección de datos personales de los usuarios.</p>
                 </div>
              </div>

              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[11px] mb-1">8. MODIFICACIONES</p>
                <div className="space-y-3">
                  <p>La plataforma podrá modificar estos términos previa notificación a los usuarios registrados.</p>
                 </div>
              </div>

              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[11px] mb-1">9. LEGISLACIÓN APLICABLE</p>
                <div className="space-y-3">
                  <p>Estos términos se regirán por las leyes vigentes en la jurisdicción donde opere la plataforma.</p>
                 </div>
              </div>
              
              <div>
                <p className="font-bold text-[#D4AF37] uppercase text-[11px] mb-1">10. COMPROMISO</p>
                <div className="space-y-3">
                  <p>Los usuarios de esta plataforma se comprometen a aceptar y dar cumplimiento a todos los términos y condiciones establecidos en el presente instrumento legal, de conformidad con el ordenamiento jurídico venezolano e internacional cuando sea aplicable.</p>
                 </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer del Modal */}
        <div className="mt-8 pt-4 border-t text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase italic tracking-widest">
            Al usar este servicio, aceptas nuestro marco legal vigente.
          </p>
        </div>
      </div>
    </div>
  );
}