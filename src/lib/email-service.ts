'use server';

import nodemailer from 'nodemailer';
import type { Activo, Solicitud } from './types';
import { pb } from './pocketbase';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function getEmailTemplate(solicitud: Solicitud, activo: Activo): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Solicitud Aprobada - Archivo Histórico Salinas</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F8F3ED; color: #4A3B31;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F3ED; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(90, 30, 2, 0.08);">
              
              <!-- Header Decorativo -->
              <tr>
                <td style="background: linear-gradient(135deg, #5A1E02 0%, #8B3C10 50%, #5A1E02 100%); padding: 0; height: 8px;">
                </td>
              </tr>

              <!-- Logo y Título -->
              <tr>
                <td style="padding: 48px 40px 32px 40px; text-align: center; border-bottom: 1px solid #D9C3A3;">
                  <h1 style="margin: 0; color: #5A1E02; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">
                    Archivo Histórico de Salinas
                  </h1>
                  <p style="margin: 12px 0 0 0; color: #8B3C10; font-size: 15px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase;">
                    Yuyay
                  </p>
                </td>
              </tr>

              <!-- Badge de Estado -->
              <tr>
                <td style="padding: 32px 40px; text-align: center; background-color: #F8F3ED;">
                  <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background-color: #7C8B56; padding: 14px 32px; border-radius: 4px;">
                        <span style="color: #FFFFFF; font-size: 15px; font-weight: 500; letter-spacing: 0.5px;">
                          SOLICITUD APROBADA
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contenido Principal -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  
                  <!-- Saludo -->
                  <p style="margin: 0 0 24px 0; color: #4A3B31; font-size: 16px; line-height: 1.6; font-weight: 300;">
                    Estimado/a <strong style="color: #5A1E02; font-weight: 500;">${solicitud.nombre} ${solicitud.apellido}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 32px 0; color: #4A3B31; font-size: 16px; line-height: 1.7; font-weight: 300;">
                    Nos complace informarle que su solicitud para acceder al material del Archivo Histórico de Salinas ha sido aprobada. A continuación encontrará los detalles de su solicitud y los archivos solicitados adjuntos a este correo.
                  </p>

                  <!-- Información del Activo -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0; background-color: #F8F3ED; border-radius: 4px; overflow: hidden;">
                    <tr>
                      <td style="background-color: #5A1E02; padding: 16px 24px;">
                        <h2 style="margin: 0; color: #FFFFFF; font-size: 14px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">
                          Activo Solicitado
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 0 0 12px 0;">
                              <span style="display: block; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Título</span>
                              <span style="display: block; color: #4A3B31; font-size: 16px; font-weight: 400; line-height: 1.5;">${activo.titulo}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-top: 1px solid #D9C3A3;">
                              <span style="display: block; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Descripción</span>
                              <span style="display: block; color: #4A3B31; font-size: 15px; font-weight: 300; line-height: 1.6;">${activo.descripcion}</span>
                            </td>
                          </tr>
                          ${activo.anio || activo.autor ? `
                          <tr>
                            <td style="padding: 12px 0 0 0; border-top: 1px solid #D9C3A3;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  ${activo.anio ? `
                                  <td width="50%" style="padding-right: 12px;">
                                    <span style="display: block; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Año</span>
                                    <span style="display: block; color: #4A3B31; font-size: 15px; font-weight: 400;">${activo.anio}</span>
                                  </td>
                                  ` : ''}
                                  ${activo.autor ? `
                                  <td width="50%" style="padding-left: 12px;">
                                    <span style="display: block; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Autor</span>
                                    <span style="display: block; color: #4A3B31; font-size: 15px; font-weight: 400;">${activo.autor}</span>
                                  </td>
                                  ` : ''}
                                </tr>
                              </table>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Información de la Solicitud -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0; border: 1px solid #D9C3A3; border-radius: 4px; overflow: hidden;">
                    <tr>
                      <td style="background-color: #F8F3ED; padding: 16px 24px; border-bottom: 1px solid #D9C3A3;">
                        <h2 style="margin: 0; color: #5A1E02; font-size: 14px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">
                          Detalles de la Solicitud
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 0 0 12px 0;">
                              <span style="display: block; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Motivo</span>
                              <span style="display: block; color: #4A3B31; font-size: 14px; font-weight: 300; line-height: 1.6;">${solicitud.motivo}</span>
                            </td>
                          </tr>
                          ${solicitud.institucion ? `
                          <tr>
                            <td style="padding: 12px 0; border-top: 1px solid #D9C3A3;">
                              <span style="display: block; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Institución</span>
                              <span style="display: block; color: #4A3B31; font-size: 14px; font-weight: 400;">${solicitud.institucion}</span>
                            </td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="padding: 12px 0 0 0; border-top: 1px solid #D9C3A3;">
                              <span style="display: block; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Correo Electrónico</span>
                              <span style="display: block; color: #4A3B31; font-size: 14px; font-weight: 400;">${solicitud.correo}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Archivos Adjuntos -->
                  ${activo.archivos && activo.archivos.length > 0 ? `
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0; background-color: #F8F3ED; border-radius: 4px; border: 1px solid #D6A77A;">
                    <tr>
                      <td style="padding: 16px 24px;">
                        <span style="display: block; color: #5A1E02; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                          Archivos Adjuntos (${activo.archivos.length})
                        </span>
                        ${activo.archivos.map(file => `
                          <div style="padding: 8px 0; border-top: 1px solid #D9C3A3;">
                            <span style="color: #4A3B31; font-size: 14px; font-weight: 300;">${file}</span>
                          </div>
                        `).join('')}
                      </td>
                    </tr>
                  </table>
                  ` : ''}

                  <!-- Nota Importante -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0; background-color: #FFF9F0; border-left: 4px solid #B63A1B; border-radius: 4px;">
                    <tr>
                      <td style="padding: 20px 24px;">
                        <p style="margin: 0 0 8px 0; color: #B63A1B; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                          Términos de Uso
                        </p>
                        <p style="margin: 0; color: #5A1E02; font-size: 14px; font-weight: 300; line-height: 1.6;">
                          Este material es propiedad del Archivo Histórico de Salinas. Su uso debe ser exclusivamente para los fines indicados en su solicitud. Cualquier uso comercial o distribución no autorizada está estrictamente prohibido.
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #F8F3ED; padding: 32px 40px; text-align: center; border-top: 1px solid #D9C3A3;">
                  <p style="margin: 0 0 8px 0; color: #5A1E02; font-size: 15px; font-weight: 500;">
                    Archivo Histórico de Salinas
                  </p>
                  <p style="margin: 0 0 16px 0; color: #4A3B31; font-size: 13px; font-weight: 300; line-height: 1.5;">
                    Preservando la memoria cultural de nuestra comunidad
                  </p>
                  <p style="margin: 0; color: #8B3C10; font-size: 12px; font-weight: 300; font-style: italic;">
                    Este es un mensaje automático, por favor no responder a este correo
                  </p>
                </td>
              </tr>

              <!-- Bottom Decorative Border -->
              <tr>
                <td style="background: linear-gradient(135deg, #5A1E02 0%, #8B3C10 50%, #5A1E02 100%); padding: 0; height: 8px;">
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendApprovalEmail(
  solicitud: Solicitud,
  activo: Activo
): Promise<{ success: boolean; error?: string }> {
  try {
    // Descargar archivos del activo
    const attachments = [];
    
    if (activo.archivos && activo.archivos.length > 0) {
      for (const archivo of activo.archivos) {
        try {
          const fileUrl = pb.files.getURL(activo, archivo);
          const response = await fetch(fileUrl);
          
          if (!response.ok) {
            console.error(`Error descargando archivo ${archivo}: ${response.statusText}`);
            continue;
          }
          
          const buffer = await response.arrayBuffer();
          
          attachments.push({
            filename: archivo,
            content: Buffer.from(buffer),
          });
        } catch (fileError) {
          console.error(`Error procesando archivo ${archivo}:`, fileError);
        }
      }
    }

    const mailOptions = {
      from: {
        name: 'Archivo Histórico de Salinas',
        address: process.env.GMAIL_USER!,
      },
      to: solicitud.correo,
      subject: `Solicitud Aprobada - ${activo.titulo} | Archivo Histórico Salinas`,
      html: getEmailTemplate(solicitud, activo),
      attachments,
    };

    await transporter.sendMail(mailOptions);
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Error enviando correo:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al enviar correo'
    };
  }
}
