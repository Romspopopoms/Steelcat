import nodemailer from 'nodemailer';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Configuration du transporteur Nodemailer (singleton pour réutilisation)
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10s connection timeout
      socketTimeout: 30000, // 30s socket timeout
      pool: true, // Use connection pooling
      maxConnections: 3,
    });
  }
  return transporter;
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
  const transporter = getTransporter();

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        ${escapeHtml(item.name)} - ${escapeHtml(item.weight)}
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
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 40px 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px;">STEELCAT</h1>
          <p style="color: #cccccc; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 0.5px;">LITIÈRE PREMIUM</p>
        </div>

        <!-- Success Badge -->
        <div style="text-align: center; padding: 24px 32px 0 32px;">
          <div style="display: inline-block; background-color: #10B981; color: white; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 14px;">
            ✓ COMMANDE CONFIRMÉE
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <h2 style="color: #000000; margin: 0 0 16px 0; font-size: 24px; font-weight: 700;">Merci pour votre commande !</h2>
          <p style="color: #4B5563; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
            Bonjour <strong>${escapeHtml(data.customerName)}</strong>,
          </p>
          <p style="color: #4B5563; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
            Nous avons bien reçu votre commande <strong style="color: #000;">#${escapeHtml(data.orderNumber)}</strong> et votre paiement a été confirmé. Nous préparons votre colis avec le plus grand soin.
          </p>

          ${deliveryInfo}

          <!-- Order Details -->
          <div style="background-color: #F9FAFB; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #E5E7EB;">
            <h3 style="margin: 0 0 20px 0; color: #000000; font-size: 18px; font-weight: 700;">Détails de la commande</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #E5E7EB;">
                  <th style="padding: 12px 8px; text-align: left; font-size: 13px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">Produit</th>
                  <th style="padding: 12px 8px; text-align: center; font-size: 13px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">Qté</th>
                  <th style="padding: 12px 8px; text-align: right; font-size: 13px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">Prix unit.</th>
                  <th style="padding: 12px 8px; text-align: right; font-size: 13px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 12px 8px; text-align: right; color: #6B7280; font-size: 14px;">Sous-total</td>
                  <td style="padding: 12px 8px; text-align: right; font-weight: 600; font-size: 14px;">${data.subtotal.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 12px 8px; text-align: right; color: #6B7280; font-size: 14px;">Frais de livraison</td>
                  <td style="padding: 12px 8px; text-align: right; font-weight: 600; font-size: 14px; color: ${data.shipping === 0 ? '#10B981' : '#000'};">${data.shipping === 0 ? 'GRATUIT' : data.shipping.toFixed(2) + '€'}</td>
                </tr>
                <tr style="background-color: #F3F4F6;">
                  <td colspan="3" style="padding: 16px 8px; text-align: right; border-top: 2px solid #000; font-size: 18px; font-weight: 700;">TOTAL</td>
                  <td style="padding: 16px 8px; text-align: right; border-top: 2px solid #000; font-size: 20px; font-weight: 700; color: #000;">${data.total.toFixed(2)}€</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Info Box -->
          <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0; color: #1E40AF; font-size: 14px; line-height: 1.6;">
              <strong style="display: block; margin-bottom: 8px;">📧 Prochaines étapes</strong>
              Vous recevrez un email de confirmation d'expédition avec le numéro de suivi dès que votre colis sera en route.
            </p>
          </div>

          <p style="color: #6B7280; margin: 24px 0 8px 0; font-size: 14px; line-height: 1.6;">
            Une question ? Notre équipe est là pour vous aider à <a href="mailto:sav@steel-cat.com" style="color: #000; text-decoration: none; font-weight: 600;">sav@steel-cat.com</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 32px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="margin: 0 0 16px 0; color: #6B7280; font-size: 14px; font-weight: 600;">STEELCAT</p>
          <p style="margin: 0 0 12px 0; color: #9CA3AF; font-size: 13px;">Litière Premium en Acier Inoxydable</p>
          <p style="margin: 0; color: #9CA3AF; font-size: 12px;">© ${new Date().getFullYear()} SteelCat. Tous droits réservés.</p>
          <div style="margin-top: 16px;">
            <a href="https://steel-cat.com" style="color: #6B7280; text-decoration: none; font-size: 12px; margin: 0 8px;">Boutique</a>
            <span style="color: #D1D5DB;">|</span>
            <a href="mailto:sav@steel-cat.com" style="color: #6B7280; text-decoration: none; font-size: 12px; margin: 0 8px;">Contact</a>
            <span style="color: #D1D5DB;">|</span>
            <a href="https://steel-cat.com/cgv" style="color: #6B7280; text-decoration: none; font-size: 12px; margin: 0 8px;">CGV</a>
          </div>
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
  const transporter = getTransporter();

  const itemsList = data.items.map(item => `
    <li style="margin: 8px 0;">${escapeHtml(item.name)} - ${escapeHtml(item.weight)}</li>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Votre précommande est disponible</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 40px 32px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 12px;">📦</div>
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Bonne nouvelle !</h1>
          <p style="color: #DBEAFE; margin: 8px 0 0 0; font-size: 15px;">Votre précommande est disponible</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <h2 style="color: #000000; margin: 0 0 16px 0; font-size: 24px; font-weight: 700;">Votre commande est prête !</h2>
          <p style="color: #4B5563; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
            Bonjour <strong>${escapeHtml(data.customerName)}</strong>,
          </p>
          <p style="color: #4B5563; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
            Excellente nouvelle ! Les produits de votre précommande <strong style="color: #000;">#${escapeHtml(data.orderNumber)}</strong> sont maintenant disponibles et seront expédiés dans les prochaines <strong>24-48 heures</strong>.
          </p>

          <div style="background-color: #EFF6FF; padding: 24px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #3B82F6;">
            <h3 style="margin: 0 0 16px 0; color: #1E40AF; font-size: 16px; font-weight: 700;">Articles disponibles :</h3>
            <ul style="margin: 0; padding-left: 20px; color: #1E40AF; line-height: 1.8;">
              ${itemsList}
            </ul>
          </div>

          <div style="background-color: #F0FDF4; border-left: 4px solid #10B981; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0; color: #065F46; font-size: 14px; line-height: 1.6;">
              <strong style="display: block; margin-bottom: 8px;">✅ Prochaines étapes</strong>
              Vous recevrez un email de confirmation d'expédition avec le numéro de suivi dès que votre colis sera en route.
            </p>
          </div>

          <p style="color: #4B5563; margin: 24px 0 8px 0; font-size: 15px; line-height: 1.6;">
            Merci pour votre patience et votre confiance !
          </p>
          <p style="color: #6B7280; margin: 16px 0 8px 0; font-size: 14px; line-height: 1.6;">
            Une question ? Contactez-nous à <a href="mailto:sav@steel-cat.com" style="color: #000; text-decoration: none; font-weight: 600;">sav@steel-cat.com</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #F9FAFB; padding: 32px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="margin: 0 0 16px 0; color: #6B7280; font-size: 14px; font-weight: 600;">STEELCAT</p>
          <p style="margin: 0 0 12px 0; color: #9CA3AF; font-size: 13px;">Litière Premium en Acier Inoxydable</p>
          <p style="margin: 0; color: #9CA3AF; font-size: 12px;">© ${new Date().getFullYear()} SteelCat. Tous droits réservés.</p>
          <div style="margin-top: 16px;">
            <a href="https://steel-cat.com" style="color: #6B7280; text-decoration: none; font-size: 12px; margin: 0 8px;">Boutique</a>
            <span style="color: #D1D5DB;">|</span>
            <a href="mailto:sav@steel-cat.com" style="color: #6B7280; text-decoration: none; font-size: 12px; margin: 0 8px;">Contact</a>
            <span style="color: #D1D5DB;">|</span>
            <a href="https://steel-cat.com/cgv" style="color: #6B7280; text-decoration: none; font-size: 12px; margin: 0 8px;">CGV</a>
          </div>
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
