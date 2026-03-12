import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Desestructuración con los datos necesarios para el mensaje (Lógica Original)
    const { email, nombre, inpre, ubicacion } = await request.json();

    const data = await resend.emails.send({
      // ✅ ACTUALIZADO: Identidad oficial bajo el dominio verificado
      from: 'Tu Abogado Sin Fronteras <gestion@tuabogadosinfronteras.com>',
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
                    <p style="color: #ffffff; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; margin-top: 5px; opacity: 0.8;">Registro de Especialistas TASF</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #ffffff; font-size: 16px;">Estimado(a) <strong> Abogad@ ${nombre}</strong>,</p>
                    <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
                      Hemos recibido su solicitud de ingreso a la red de <strong>Tu Abogado Sin Fronteras Venezuela</strong> para el estado <strong>${ubicacion}</strong>. Sus credenciales e imágenes de validación bajo el número de INPRE <strong>${inpre}</strong> han sido enviadas al departamento de auditoría legal.
                    </p>
                    
                    <div style="margin: 30px 0; padding: 20px; border-left: 3px solid #D4AF37; background-color: #1d1d1d;">
                      <p style="color: #D4AF37; font-size: 12px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase;">Protocolo de Seguridad TASF:</p>
                      <p style="color: #ffffff; font-size: 13px; margin: 0; line-height: 1.5;">
                        Nuestro equipo auditor verificará la autenticidad de su carnet profesional y la <strong>coincidencia biométrica de su identidad</strong> en un plazo máximo de <strong>3 días hábiles</strong>. Una vez validado, recibirá sus credenciales de acceso.
                      </p>
                    </div>

                    <div style="margin: 30px 0; padding: 20px; border: 1px dashed #D4AF37; background-color: #141414; border-radius: 10px;">
                      <p style="color: #D4AF37; font-size: 11px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; text-align: center;">Acuerdo de Gestión y Honorarios:</p>
                      <p style="color: #ffffff; font-size: 13px; margin: 0; line-height: 1.6; text-align: center; opacity: 0.9;">
                        Se establece formalmente que la plataforma retendrá el <strong>20% del valor total</strong> de los honorarios percibidos por cada caso gestionado a través de nuestro sistema, en concepto de gastos administrativos, captación de clientes y soporte tecnológico.
                      </p>
                    </div>

                    <p style="color: #666666; font-size: 12px; text-align: center; font-style: italic;">
                      "Garantizando la excelencia jurídica y la seguridad profesional en Venezuela."
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px; background-color: #0d0d0d; border-top: 1px solid #222222;">
                    <p style="color: #444444; font-size: 9px; margin: 0;">© 2026 Tu Abogado Sin Fronteras. Sistema de Seguridad y Auditoría Legal.</p>
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
    console.error("Error en envío de correo:", error);
    return NextResponse.json({ success: false, error: "Error en el registro de notificación" }, { status: 500 });
  }
}