import nodemailer from 'nodemailer';

// Configuration du transporteur Nodemailer
function createTransporter() {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true pour 465, false pour les autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  email: string;
  items: Array<{
    name: string;
    weight: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  isPreOrder: boolean;
  estimatedDelivery?: Date | null;
}

// Email de confirmation de commande
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const transporter = createTransporter();

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        ${item.name} - ${item.weight}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        ${item.price.toFixed(2)}€
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">
        ${(item.price * item.quantity).toFixed(2)}€
      </td>
    </tr>
  `).join('');

  const deliveryInfo = data.isPreOrder && data.estimatedDelivery
    ? `
      <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px; margin: 24px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 8px 0; color: #1E40AF; font-size: 16px;">📦 Précommande</h3>
        <p style="margin: 0; color: #1E40AF;">
          Votre commande contient des articles en précommande.
          Livraison estimée : <strong>${new Date(data.estimatedDelivery).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </p>
      </div>
    `
    : `
      <p style="color: #10B981; font-weight: 600; margin: 16px 0;">
        ✅ Livraison estimée : 2-3 jours ouvrés
      </p>
    `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de commande</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #000000; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">SteelCat</h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <h2 style="color: #000000; margin: 0 0 16px 0;">Merci pour votre commande !</h2>
          <p style="color: #666666; margin: 0 0 24px 0;">
            Bonjour ${data.customerName},
          </p>
          <p style="color: #666666; margin: 0 0 24px 0;">
            Nous avons bien reçu votre commande <strong>${data.orderNumber}</strong> et nous vous remercions de votre confiance.
          </p>

          ${deliveryInfo}

          <!-- Order Details -->
          <div style="background-color: #f9f9f9; padding: 24px; border-radius: 8px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px 0; color: #000000;">Détails de la commande</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; color: #666;">Produit</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd; color: #666;">Qté</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd; color: #666;">Prix unit.</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd; color: #666;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right; color: #666;">Sous-total</td>
                  <td style="padding: 12px; text-align: right; font-weight: 600;">${data.subtotal.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right; color: #666;">Frais de livraison</td>
                  <td style="padding: 12px; text-align: right; font-weight: 600;">${data.shipping.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #000; font-size: 18px; font-weight: 600;">Total</td>
                  <td style="padding: 12px; text-align: right; border-top: 2px solid #000; font-size: 18px; font-weight: 600;">${data.total.toFixed(2)}€</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p style="color: #666666; margin: 24px 0 0 0;">
            Vous recevrez un email de confirmation d'expédition dès que votre colis sera en route.
          </p>
          <p style="color: #666666; margin: 8px 0 0 0;">
            Si vous avez des questions, n'hésitez pas à nous contacter.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 24px; text-align: center; color: #666666; font-size: 14px;">
          <p style="margin: 0;">© 2024 SteelCat - Litière Premium pour Chat</p>
          <p style="margin: 8px 0 0 0;">
            <a href="#" style="color: #666666; text-decoration: none;">Voir ma commande</a> |
            <a href="#" style="color: #666666; text-decoration: none;">Nous contacter</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: data.email,
    subject: `Confirmation de commande ${data.orderNumber}`,
    html,
  });
}

// Email de notification de disponibilité pour précommandes
export async function sendAvailabilityNotificationEmail(data: {
  orderNumber: string;
  customerName: string;
  email: string;
  items: Array<{
    name: string;
    weight: string;
  }>;
}) {
  const transporter = createTransporter();

  const itemsList = data.items.map(item => `
    <li style="margin: 8px 0;">${item.name} - ${item.weight}</li>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Votre précommande est disponible</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #3B82F6; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">📦 Bonne nouvelle !</h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <h2 style="color: #000000; margin: 0 0 16px 0;">Votre précommande est disponible</h2>
          <p style="color: #666666; margin: 0 0 24px 0;">
            Bonjour ${data.customerName},
          </p>
          <p style="color: #666666; margin: 0 0 24px 0;">
            Excellente nouvelle ! Les produits de votre précommande <strong>${data.orderNumber}</strong> sont maintenant disponibles et seront expédiés dans les prochaines 24-48 heures.
          </p>

          <div style="background-color: #EFF6FF; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #3B82F6;">
            <h3 style="margin: 0 0 12px 0; color: #1E40AF;">Articles disponibles :</h3>
            <ul style="margin: 0; padding-left: 20px; color: #1E40AF;">
              ${itemsList}
            </ul>
          </div>

          <p style="color: #666666; margin: 24px 0 0 0;">
            Vous recevrez un email de confirmation d'expédition avec le numéro de suivi dès que votre colis sera en route.
          </p>
          <p style="color: #666666; margin: 16px 0 0 0;">
            Merci pour votre patience et votre confiance !
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 24px; text-align: center; color: #666666; font-size: 14px;">
          <p style="margin: 0;">© 2024 SteelCat - Litière Premium pour Chat</p>
          <p style="margin: 8px 0 0 0;">
            <a href="#" style="color: #666666; text-decoration: none;">Voir ma commande</a> |
            <a href="#" style="color: #666666; text-decoration: none;">Nous contacter</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: data.email,
    subject: `🎉 Votre précommande ${data.orderNumber} est disponible !`,
    html,
  });
}
