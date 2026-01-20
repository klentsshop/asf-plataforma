import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Sanity envía el cuerpo del documento en la petición
    const body = await request.json();
    
    // Extraemos los datos necesarios del documento de Sanity
    const { email, nombre, password } = body;

    // Validación de seguridad para evitar envíos vacíos
    if (!email || !password) {
      return NextResponse.json({ error: "Datos insuficientes" }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: 'gestion@klentsshop.com', // Asegúrate de que este dominio esté verificado en Resend
      to: [email],
      subject: `⚖️ Acceso Concedido: Bienvenido a la Red ASF`,
      html: `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; font-family: 'Segoe UI', Arial, sans-serif;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #141414; border: 1px solid #D4AF37; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <tr>
                  <td align="center" style="padding: 50px 40px 20px 40px; background-color: #1a1a1a;">
                    <div style="background-color: #D4AF37; width: 60px; height: 60px; border-radius: 15px; margin-bottom: 20px; display: table;">
                      <span style="display: table-cell; vertical-align: middle; color: #000; font-size: 30px; font-weight: bold; text-align: center;">⚖️</span>
                    </div>
                    <h2 style="color: #ffffff; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 3px; font-weight: 900; font-style: italic;">Credenciales de Acceso</h2>
                    <p style="color: #D4AF37; font-size: 11px; text-transform: uppercase; letter-spacing: 5px; margin-top: 10px; font-weight: bold;">Estatus: Aprobado</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #ffffff; font-size: 18px; margin-bottom: 20px;">Bienvenido al Panel de Especialistas, <strong>Abg. ${nombre}</strong></p>
                    <p style="color: #888888; font-size: 14px; line-height: 1.7; margin-bottom: 30px;">
                      Sus credenciales han sido verificadas exitosamente por la dirección legal. A partir de este momento, usted tiene acceso a los casos activos disponibles de <strong>Abogados Sin Fronteras</strong>.
                    </p>
                    
                    <div style="background-color: #000000; border: 1px solid #333333; border-radius: 15px; padding: 25px; margin-bottom: 30px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <span style="color: #666666; font-size: 10px; text-transform: uppercase; display: block; margin-bottom: 5px;">Usuario de Red</span>
                            <span style="color: #ffffff; font-size: 16px; font-weight: bold;">${email}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style="color: #666666; font-size: 10px; text-transform: uppercase; display: block; margin-bottom: 5px;">Clave Temporal</span>
                            <span style="color: #D4AF37; font-size: 22px; font-weight: bold; letter-spacing: 2px;">${password}</span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <p style="color: #D4AF37; font-size: 12px; font-weight: bold; text-align: center; margin-bottom: 10px;">PRÓXIMO PASO:</p>
                    <p style="color: #888888; font-size: 13px; line-height: 1.6; text-align: center;">
                      Inicie sesión en su panel y <strong>cambie su contraseña</strong> en la sección de configuración por razones de seguridad.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 30px; background-color: #0d0d0d; border-top: 1px solid #222222;">
                    <p style="color: #444444; font-size: 10px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Seguridad ASF Cripto-Blindada 2026</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error en API Aprobar Abogado:", error);
    return NextResponse.json({ success: false, error: "Error enviando acceso" }, { status: 500 });
  }
}