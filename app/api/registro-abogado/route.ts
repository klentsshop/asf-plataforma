import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Agregamos 'ubicacion' a la desestructuración
    const { email, nombre, inpre, ubicacion } = await request.json();

    const data = await resend.emails.send({
      from: 'gestion@klentsshop.com',
      to: [email],
      subject: `Postulación Recibida: Abg. ${nombre}`,
      html: `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; font-family: Arial, sans-serif;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #141414; border: 1px solid #D4AF37; border-radius: 15px; overflow: hidden;">
                <tr>
                  <td align="center" style="padding: 40px 20px; background-color: #1a1a1a;">
                    <h2 style="color: #D4AF37; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 2px;">Solicitud en Revisión</h2>
                    <p style="color: #ffffff; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; margin-top: 5px; opacity: 0.8;">Registro de Especialistas ASF</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #ffffff; font-size: 16px;">Estimado(a) <strong>Abg. ${nombre}</strong>,</p>
                    <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
                      Hemos recibido su solicitud de ingreso a la red de <strong>Abogados Sin Fronteras Venezuela</strong> para el estado <strong>${ubicacion}</strong>. Sus credenciales bajo el número de INPRE <strong>${inpre}</strong> han sido enviadas al departamento de auditoría legal.
                    </p>
                    
                    <div style="margin: 30px 0; padding: 20px; border-left: 3px solid #D4AF37; background-color: #1d1d1d;">
                      <p style="color: #D4AF37; font-size: 12px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase;">Protocolo de Validación:</p>
                      <p style="color: #ffffff; font-size: 13px; margin: 0; line-height: 1.5;">
                        Nuestro equipo cuenta con un plazo máximo de <strong>3 días hábiles</strong> para verificar su documentación. Una vez validada, recibirá sus credenciales de acceso definitivas para operar en <strong>${ubicacion}</strong>.
                      </p>
                    </div>

                    <p style="color: #666666; font-size: 12px; text-align: center; font-style: italic;">
                      "Garantizando la excelencia jurídica en cada rincón del país."
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px; background-color: #0d0d0d; border-top: 1px solid #222222;">
                    <p style="color: #444444; font-size: 9px; margin: 0;">© 2026 Abogados Sin Fronteras. Sistema de Seguridad Profesional.</p>
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
    return NextResponse.json({ success: false, error: "Error en el registro" }, { status: 500 });
  }
}