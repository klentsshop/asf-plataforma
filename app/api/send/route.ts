import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, nombre, casoId, codigoExpediente } = body

    if (!email || (!casoId && !codigoExpediente)) {
      return NextResponse.json(
        { success: false, error: "Datos insuficientes para el envío" },
        { status: 400 }
      )
    }

    const safeNombre = nombre || "Cliente"
    const displayID = codigoExpediente || casoId

    const data = await resend.emails.send({
      // ✅ Dominio verificado y nombre oficial
      from: 'Tu Abogado Sin Fronteras <gestion@tuabogadosinfronteras.com>',
      to: email,
      subject: `Expediente Oficial TASF: ${displayID}`,
      html: `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #111111; font-family: Arial, sans-serif;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1a1a1a; border: 1px solid #D4AF37; border-radius: 10px; overflow: hidden;">
                <tr>
                  <td align="center" style="padding: 40px 20px 20px 20px;">
                    <div style="background-color: #D4AF37; display: inline-block; padding: 10px; border-radius: 8px; margin-bottom: 20px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" width="40" height="40" alt="TASF" style="display: block;">
                    </div>
                    <h2 style="color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Expediente Generado</h2>
                    <p style="color: #D4AF37; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; margin-top: 5px; opacity: 0.8;">Protección Legal Blindada</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 40px;">
                    <p style="color: #ffffff; font-size: 16px;">Estimado(a) <strong>${safeNombre}</strong>,</p>
                    <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
                      Su solicitud ha sido procesada con éxito. Se ha generado un expediente oficial bajo altos estándares de seguridad y cifrado.
                    </p>

                    <div style="margin: 25px 0; padding: 20px; background-color: #222; border: 1px dashed #D4AF37; border-radius: 12px; text-align: center;">
                      <span style="color: #D4AF37; font-size: 10px; text-transform: uppercase; display: block; margin-bottom: 8px; font-weight: bold; letter-spacing: 1px;">ID de Acceso a Usuario</span>
                      <span style="color: #ffffff; font-size: 26px; font-weight: bold; letter-spacing: 2px;">${displayID}</span>
                    </div>

                    <p style="color: #ffffff; font-size: 14px; font-weight: bold; margin-top: 30px; text-transform: uppercase; letter-spacing: 1px;">⚠️ Próximo Paso Obligatorio:</p>
                    <p style="color: #cccccc; font-size: 13px; line-height: 1.6;">
                      Una vez que tenga sus credenciales, debe realizar el pago de su defensa legal personal a través de los canales autorizados TASF:
                    </p>

                    <div style="margin: 20px 0; padding: 20px; background-color: #111; border-left: 4px solid #D4AF37; border-radius: 4px;">
                      <p style="color: #D4AF37; font-size: 12px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">Banco de Venezuela (Corriente)</p>
                      <p style="color: #ffffff; font-size: 13px; margin: 0;">Titular: <strong>Liz Pineda</strong></p>
                      <p style="color: #ffffff; font-size: 13px; margin: 0;">C.I: <strong>16.268.588</strong></p>
                      <p style="color: #D4AF37; font-size: 14px; font-weight: bold; margin-top: 5px; letter-spacing: 1px;">0102 0215 9100 0022 8578</p>
                      
                      <div style="margin-top: 20px; border-top: 1px solid #333; padding-top: 15px;">
                        <p style="color: #D4AF37; font-size: 12px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">Bancolombia (Ahorros)</p>
                        <p style="color: #ffffff; font-size: 13px; margin: 0;">Titular: <strong>Liz Pineda</strong></p>
                        <p style="color: #ffffff; font-size: 13px; margin: 0;">Pasaporte: <strong>5005042972</strong></p>
                        <p style="color: #D4AF37; font-size: 14px; font-weight: bold; margin-top: 5px; letter-spacing: 1px;">1080 0008 109</p>
                      </div>
                    </div>

                    <ul style="color: #cccccc; font-size: 13px; line-height: 1.8; padding-left: 20px;">
                      <li>Utilice su correo y el ID para entrar a su Usuario.</li>
                      <li>Dentro de su cuenta deberá <strong>cargar el comprobante de pago</strong>.</li>
                      <li>Este código es personal e intransferible.</li>
                    </ul>

                    <div style="margin-top: 35px; text-align: center;">
                      <a href="https://tuabogadosinfronteras.com/boveda" style="background-color: #D4AF37; color: #000000; padding: 18px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Entrar a mi Usuario</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 25px; background-color: #111; border-top: 1px solid #333;">
                    <p style="color: #666; font-size: 10px; margin: 0;">© 2026 Tu Abogado Sin Fronteras Venezuela</p>
                    <p style="color: #444; font-size: 8px; margin-top: 5px; text-transform: uppercase;">Expediente: ${displayID} | ID Interno: ${casoId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    })

    console.log("[RESEND RESPONSE]", data)

    if (data.error) {
      console.error("[RESEND DELIVERY ERROR]", data.error)
      return NextResponse.json(
        { success: false, error: data.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("[RESEND ERROR]", error)
    return NextResponse.json(
      { success: false, error: error?.message || "Error al enviar correo" },
      { status: 500 }
    )
  }
}