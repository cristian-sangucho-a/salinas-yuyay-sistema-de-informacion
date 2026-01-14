import { ClientData, AddressData, CartItem } from "../../types/productivo";

export function getOrderConfirmationTemplate(
  client: ClientData,
  address: AddressData,
  items: CartItem[],
  total: number
): string {
  const formatter = new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  });

  return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Pedido - Salinas Yuyay</title>
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
                  <td style="background: linear-gradient(135deg, #7C8B56 0%, #A4B17A 50%, #7C8B56 100%); padding: 0; height: 8px;">
                  </td>
                </tr>
  
                <!-- Logo y Título -->
                <tr>
                  <td style="padding: 48px 40px 32px 40px; text-align: center; border-bottom: 1px solid #D9C3A3;">
                    <h1 style="margin: 0; color: #5A1E02; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">
                      Salinas Yuyay
                    </h1>
                    <p style="margin: 12px 0 0 0; color: #7C8B56; font-size: 15px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase;">
                      Tienda Artesanal
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
                            ¡PEDIDO CONFIRMADO!
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
                      Hola <strong style="color: #5A1E02; font-weight: 500;">${
                        client.razon_social
                      }</strong>,
                    </p>
                    
                    <p style="margin: 0 0 32px 0; color: #4A3B31; font-size: 16px; line-height: 1.7; font-weight: 300;">
                      Hemos recibido tu pedido correctamente. A continuación te presentamos el resumen de tu compra. Nos pondremos en contacto contigo pronto para coordinar el pago y la entrega.
                    </p>
  
                    <!-- Resumen de Items -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0; border: 1px solid #D9C3A3; border-radius: 4px; overflow: hidden;">
                      <thead>
                        <tr>
                          <th align="left" style="background-color: #F8F3ED; padding: 12px 16px; border-bottom: 1px solid #D9C3A3; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase;">Producto</th>
                          <th align="center" style="background-color: #F8F3ED; padding: 12px 16px; border-bottom: 1px solid #D9C3A3; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase;">Cant.</th>
                          <th align="right" style="background-color: #F8F3ED; padding: 12px 16px; border-bottom: 1px solid #D9C3A3; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase;">Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${items
                          .map(
                            (item) => `
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #E5E5E5;">
                              <span style="display: block; color: #4A3B31; font-size: 14px; font-weight: 500;">${
                                item.name
                              }</span>
                            </td>
                            <td align="center" style="padding: 12px 16px; border-bottom: 1px solid #E5E5E5; color: #4A3B31; font-size: 14px;">
                              ${item.quantity}
                            </td>
                            <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #E5E5E5; color: #4A3B31; font-size: 14px; font-weight: 500;">
                              ${formatter.format(item.price * item.quantity)}
                            </td>
                          </tr>
                        `
                          )
                          .join("")}
                      </tbody>
                      <tfoot>
                        <tr>
                           <td colspan="2" align="right" style="background-color: #F8F3ED; padding: 12px 16px; border-top: 1px solid #D9C3A3; color: #5A1E02; font-size: 14px; font-weight: 700;">TOTAL</td>
                           <td align="right" style="background-color: #F8F3ED; padding: 12px 16px; border-top: 1px solid #D9C3A3; color: #5A1E02; font-size: 16px; font-weight: 700;">${formatter.format(
                             total
                           )}</td>
                        </tr>
                      </tfoot>
                    </table>
  
                    <!-- Información de Envío -->
                     <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0; background-color: #F8F3ED; border-radius: 4px; overflow: hidden;">
                      <tr>
                        <td style="background-color: #7C8B56; padding: 16px 24px;">
                          <h2 style="margin: 0; color: #FFFFFF; font-size: 14px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">
                            Datos de Envío
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 0 0 12px 0;">
                                <span style="display: block; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Dirección</span>
                                <span style="display: block; color: #4A3B31; font-size: 15px; font-weight: 400;">
                                  ${address.callePrincipal} 
                                  ${
                                    address.calleSecundaria
                                      ? `y ${address.calleSecundaria}`
                                      : ""
                                  }
                                </span>
                                <span style="display: block; color: #4A3B31; font-size: 14px; font-weight: 300; margin-top: 4px;">
                                  ${address.ciudad}, ${address.provincia}
                                </span>
                              </td>
                            </tr>
                            ${
                              address.referencia
                                ? `
                            <tr>
                              <td style="padding: 12px 0 0 0; border-top: 1px solid #D9C3A3;">
                                <span style="display: block; color: #8B3C10; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Referencia</span>
                                <span style="display: block; color: #4A3B31; font-size: 14px; font-weight: 300;">${address.referencia}</span>
                              </td>
                            </tr>
                            `
                                : ""
                            }
                          </table>
                        </td>
                      </tr>
                    </table>
  
                    <!-- Footer Info -->
                    <p style="text-align: center; margin: 32px 0 0 0; color: #4A3B31; font-size: 13px; line-height: 1.6;">
                      Si tienes alguna pregunta sobre tu pedido, por favor contáctanos respondiendo a este correo o llámanos.
                    </p>
  
                  </td>
                </tr>
  
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F8F3ED; padding: 32px 40px; text-align: center; border-top: 1px solid #D9C3A3;">
                    <p style="margin: 0 0 8px 0; color: #5A1E02; font-size: 15px; font-weight: 500;">
                      Salinas Yuyay
                    </p>
                    <p style="margin: 0; color: #8B3C10; font-size: 12px; font-weight: 300; font-style: italic;">
                      Gracias por apoyar el comercio local
                    </p>
                  </td>
                </tr>
  
                <!-- Bottom Decorative Border -->
                <tr>
                  <td style="background: linear-gradient(135deg, #7C8B56 0%, #A4B17A 50%, #7C8B56 100%); padding: 0; height: 8px;">
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
