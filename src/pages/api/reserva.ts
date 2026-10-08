import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';
import {
  calculateReservationQuote,
  buildOwnerEmail,
  buildClientImmediateEmail,
  buildPreArrivalEmail,
  buildPostStayEmail,
} from '../../lib/emailTemplates';

export const prerender = false;

const OWNER_EMAIL = 'casarural@rojodeltietar.com';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      nombre = 'Cliente',
      email = '',
      telefono = '',
      llegada = '',
      salida = '',
      huespedes = 10,
      mensaje = '',
      mascota = false,
      interesCatering = false,
      origenFormulario = 'Formulario Web Casa Rojo del Tiétar',
      sendFollowUpDemo = false,
    } = body;

    if (!nombre || !telefono || !llegada || !salida) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Por favor completa nombre, teléfono y fechas de llegada y salida.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const lead = calculateReservationQuote({
      nombre,
      email,
      telefono,
      llegada,
      salida,
      huespedes,
      mensaje,
      mascota,
      interesCatering,
      origenFormulario,
    });

    const ownerMail = buildOwnerEmail(lead);
    const clientMail = buildClientImmediateEmail(lead);
    const preArrivalMail = buildPreArrivalEmail(lead);
    const postStayMail = buildPostStayEmail(lead);

    // Save lead to local CRM JSON log
    try {
      const dataDir = path.resolve(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const logFile = path.join(dataDir, 'reservas-leads.json');
      const existing = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf8')) : [];
      existing.unshift({
        ...lead,
        pipeline: [
          { step: 1, name: 'Confirmación inmediata y presupuesto', status: 'sent', sentAt: new Date().toISOString() },
          { step: 2, name: 'Guía Pre-Llegada (48h antes del Check-in)', status: 'scheduled', trigger: '48h before arrival' },
          { step: 3, name: 'Cierre Post-Estancia y devolución de fianza (100 €)', status: 'scheduled', trigger: '24h after checkout' },
        ],
      });
      fs.writeFileSync(logFile, JSON.stringify(existing, null, 2), 'utf8');
    } catch {
      // Non-fatal on read-only filesystems
    }

    // Send via SMTP if configured
    let smtpSent = false;
    let smtpDetails = '';
    const smtpHost = process.env.SMTP_HOST || '';
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = process.env.SMTP_USER || '';
    const smtpPass = process.env.SMTP_PASS || '';

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: { rejectUnauthorized: false },
      });

      // 1. Send to Casa Rojo del Tiétar (casarural@rojodeltietar.com) + copy to guest if testing
      await transporter.sendMail({
        from: `"Reservas Casa Rojo del Tiétar" <${smtpUser}>`,
        to: OWNER_EMAIL,
        replyTo: lead.email || OWNER_EMAIL,
        subject: ownerMail.subject,
        html: ownerMail.html,
      });

      // 2. Send immediate confirmation to guest
      if (lead.email) {
        await transporter.sendMail({
          from: `"Casa Rojo del Tiétar" <${smtpUser}>`,
          to: lead.email,
          replyTo: OWNER_EMAIL,
          subject: clientMail.subject,
          html: clientMail.html,
        });

        // If demo mode requested, also send the Owner Email copy + Follow-up previews to the test client email
        if (sendFollowUpDemo) {
          await transporter.sendMail({
            from: `"Casa Rojo del Tiétar (Copia Aviso Interno)" <${smtpUser}>`,
            to: lead.email,
            replyTo: lead.email,
            subject: `[COPIA AVISO INTERNO A casarural@rojodeltietar.com] ${ownerMail.subject}`,
            html: ownerMail.html,
          });
          await transporter.sendMail({
            from: `"Casa Rojo del Tiétar" <${smtpUser}>`,
            to: lead.email,
            replyTo: OWNER_EMAIL,
            subject: `[SEGUIMIENTO PASO 2 · 48h ANTES] ${preArrivalMail.subject}`,
            html: preArrivalMail.html,
          });
          await transporter.sendMail({
            from: `"Casa Rojo del Tiétar" <${smtpUser}>`,
            to: lead.email,
            replyTo: OWNER_EMAIL,
            subject: `[SEGUIMIENTO PASO 3 · POST-ESTANCIA] ${postStayMail.subject}`,
            html: postStayMail.html,
          });
        }
      }
      smtpSent = true;
      smtpDetails = `Enviado a ${OWNER_EMAIL}${lead.email ? ` y a ${lead.email}` : ''}`;
    } catch (err: any) {
      smtpDetails = err?.message || 'SMTP no disponible en entorno local';
    }

    return new Response(
      JSON.stringify({
        ok: true,
        lead,
        destinationOwner: OWNER_EMAIL,
        smtpSent,
        smtpDetails,
        emails: {
          owner: ownerMail,
          clientImmediate: clientMail,
          preArrival: preArrivalMail,
          postStay: postStayMail,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ ok: false, error: error?.message || 'Error procesando la solicitud' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
