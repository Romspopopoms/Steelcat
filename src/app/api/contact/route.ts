import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const transporter = createTransporter();

    // Envoyer l'email au SAV
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'sav@steel-cat.com',
      replyTo: validatedData.email,
      subject: `[Contact] ${validatedData.subject}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${validatedData.name}</p>
        <p><strong>Email :</strong> ${validatedData.email}</p>
        <p><strong>Sujet :</strong> ${validatedData.subject}</p>
        <hr />
        <p>${validatedData.message.replace(/\n/g, '<br />')}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">Message envoyé depuis le formulaire de contact steel-cat.com</p>
      `,
    });

    // Envoyer un accusé de réception au client
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: validatedData.email,
      subject: 'SteelCat - Nous avons bien reçu votre message',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: #000; padding: 32px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">STEELCAT</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #000; margin: 0 0 16px 0;">Merci pour votre message !</h2>
              <p style="color: #4B5563; line-height: 1.6;">
                Bonjour <strong>${validatedData.name}</strong>,
              </p>
              <p style="color: #4B5563; line-height: 1.6;">
                Nous avons bien reçu votre message concernant "<strong>${validatedData.subject}</strong>".
                Notre équipe vous répondra dans les plus brefs délais (sous 24-48h ouvrées).
              </p>
              <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 24px 0;">
                <p style="color: #6B7280; font-size: 14px; margin: 0 0 8px 0;"><strong>Votre message :</strong></p>
                <p style="color: #4B5563; font-size: 14px; margin: 0; white-space: pre-wrap;">${validatedData.message}</p>
              </div>
              <p style="color: #6B7280; font-size: 14px;">
                L'équipe SteelCat
              </p>
            </div>
            <div style="background-color: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; color: #9CA3AF; font-size: 12px;">&copy; ${new Date().getFullYear()} SteelCat. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Votre message a été envoyé avec succès',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Données invalides',
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error processing contact form:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi du message',
      },
      { status: 500 }
    );
  }
}
