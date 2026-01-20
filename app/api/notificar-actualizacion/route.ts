import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, nombre, mensaje, esSolvente } = body

    if (!email) return NextResponse.json({ success: false, error: "Email requerido" }, { status: 400 });

    const safeNombre = nombre || "Cliente"

    const data = await resend.emails.send({
      from: 'ASF Gestión <gestion@klentsshop.com>',
      to: email,
      subject: `🏛️ REQUERIMIENTO LEGAL: Acción necesaria en su Bóveda`,
      html: `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #111111; font-family: Arial, sans-serif;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; border: 1px solid #D4AF37; border-radius: 10px; overflow: hidden;">
                <tr>
                  <td align="center" style="padding: 40px 20px 20px 20px;">
                    <div style="background-color: #D4AF37; display: inline-block; padding: 10px; border-radius: 8px; margin-bottom: 20px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" width="40" height="40" alt="ASF">
                    </div>
                    <h2 style="color: #D4AF37; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px;">Notificación de Avance</h2>
                    <p style="color: #ffffff; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; margin-top: 5px; opacity: 0.8;">Departamento Legal ASF</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 40px;">
                    <p style="color: #ffffff; font-size: 16px;">Estimado(a) <strong>${safeNombre}</strong>,</p>
                    <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
                      Su abogado asignado ha actualizado su expediente digital con un requerimiento técnico prioritario:
                    </p>

                    <div style="margin: 25px 0; padding: 25px; background-color: #222; border-left: 4px solid #D4AF37; border-radius: 4px; text-align: left;">
                      <span style="color: #D4AF37; font-size: 10px; text-transform: uppercase; display: block; margin-bottom: 8px; font-weight: bold;">Mensaje del Especialista</span>
                      <p style="color: #ffffff; font-size: 14px; font-style: italic; margin: 0;">"${mensaje}"</p>
                    </div>

                    <p style="color: #cccccc; font-size: 13px; line-height: 1.8;">
                      Por favor, ingrese a su Bóveda Privada para cargar los documentos solicitados o responder a esta solicitud.
                    </p>

                    <div style="margin-top: 40px; text-align: center; padding-bottom: 20px;">
                      <a href="https://klentsshop.com/boveda" style="background-color: #D4AF37; color: #000000; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 12px; text-transform: uppercase;">ACCEDER A MI BÓVEDA</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px; background-color: #111;">
                    <p style="color: #666; font-size: 9px; margin: 0;">© 2026 Abogados Sin Fronteras • Conexión TLS 1.3</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}