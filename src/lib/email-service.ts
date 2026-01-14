"use server";

import type { Activo, Solicitud } from "./types";
import { ClientData, AddressData, CartItem } from "./types/productivo";
import { pb } from "./pocketbase";
import { sendEmail } from "./email/transporter";
import { getApprovalTemplate } from "./email/templates/cultural-approval";
import { getOrderConfirmationTemplate } from "./email/templates/store-confirmation";

/**
 * Envia el correo de aprobación para solicitudes del Archivo Histórico
 */
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
            console.error(
              `Error descargando archivo ${archivo}: ${response.statusText}`
            );
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

    return await sendEmail({
      to: solicitud.correo,
      subject: `Solicitud Aprobada - ${activo.titulo} | Archivo Histórico Salinas`,
      html: getApprovalTemplate(solicitud, activo),
      fromName: "Archivo Histórico de Salinas",
      attachments,
    });
  } catch (error: unknown) {
    console.error("Error enviando correo de aprobación:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al enviar correo de aprobación",
    };
  }
}

/**
 * Envia el correo de confirmación de pedido de la Tienda
 */
export async function sendOrderConfirmationEmail(
  client: ClientData,
  address: AddressData,
  items: CartItem[],
  total: number
): Promise<{ success: boolean; error?: string }> {
  const html = getOrderConfirmationTemplate(client, address, items, total);

  return await sendEmail({
    to: client.email,
    subject: "Confirmación de Pedido - Salinas Yuyay",
    html,
    fromName: "Salinas Yuyay - Tienda",
  });
}
