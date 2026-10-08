import nodemailer from 'nodemailer';
import fs from 'node:fs';
import {
  calculateReservationQuote,
  buildOwnerEmail,
  buildClientImmediateEmail,
  buildPreArrivalEmail,
  buildPostStayEmail,
} from '../src/lib/emailTemplates.ts';

async function main() {
  const lead = calculateReservationQuote({
    nombre: 'Ismael Laredo',
    email: 'uaeup2019@gmail.com',
    telefono: '605 935 487',
    llegada: '2026-10-16',
    salida: '2026-10-18',
    huespedes: 12,
    mascota: true,
    interesCatering: true,
    mensaje:
      'Hola, somos un grupo de 12 amigos (5 parejas y 2 niños). Llegaremos el viernes sobre las 19:30h desde Madrid. Vamos con un perro tranquilo y nos gustaría saber opciones para encargar cochifrito o asado el sábado a mediodía.',
    origenFormulario: 'Formulario de Reserva Directa Web (/reservas)',
  });
  lead.id = 'RT-2026-1084';

  const ownerMail = buildOwnerEmail(lead);
  const client1 = buildClientImmediateEmail(lead);
  const client2 = buildPreArrivalEmail(lead);
  const client3 = buildPostStayEmail(lead);

  fs.mkdirSync('data/test-ismael-laredo', { recursive: true });
  fs.writeFileSync('data/test-ismael-laredo/01-email-para-casarural-rojodeltietar.html', ownerMail.html);
  fs.writeFileSync('data/test-ismael-laredo/02-email-inmediato-cliente-ismael.html', client1.html);
  fs.writeFileSync('data/test-ismael-laredo/03-email-pre-llegada-48h-ismael.html', client2.html);
  fs.writeFileSync('data/test-ismael-laredo/04-email-post-estancia-fianza-ismael.html', client3.html);
  console.log('HTML previews saved in data/test-ismael-laredo/');

  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const r1 = await transporter.sendMail({
    from: '"Reservas Web Casa Rojo del Tiétar" <casarural@rojodeltietar.com>',
    to: 'casarural@rojodeltietar.com',
    replyTo: 'Ismael Laredo <uaeup2019@gmail.com>',
    subject: ownerMail.subject,
    html: ownerMail.html,
  });
  console.log('1) Email a casarural@rojodeltietar.com ->', nodemailer.getTestMessageUrl(r1));

  const r2 = await transporter.sendMail({
    from: '"Casa Rojo del Tiétar" <casarural@rojodeltietar.com>',
    to: 'Ismael Laredo <uaeup2019@gmail.com>',
    replyTo: 'casarural@rojodeltietar.com',
    subject: client1.subject,
    html: client1.html,
  });
  console.log('2) Email 1 Inmediato a uaeup2019@gmail.com ->', nodemailer.getTestMessageUrl(r2));

  const r3 = await transporter.sendMail({
    from: '"Casa Rojo del Tiétar" <casarural@rojodeltietar.com>',
    to: 'Ismael Laredo <uaeup2019@gmail.com>',
    replyTo: 'casarural@rojodeltietar.com',
    subject: client2.subject,
    html: client2.html,
  });
  console.log('3) Email 2 Pre-Llegada (48h antes) a uaeup2019@gmail.com ->', nodemailer.getTestMessageUrl(r3));

  const r4 = await transporter.sendMail({
    from: '"Casa Rojo del Tiétar" <casarural@rojodeltietar.com>',
    to: 'Ismael Laredo <uaeup2019@gmail.com>',
    replyTo: 'casarural@rojodeltietar.com',
    subject: client3.subject,
    html: client3.html,
  });
  console.log('4) Email 3 Post-Estancia y Fianza a uaeup2019@gmail.com ->', nodemailer.getTestMessageUrl(r4));
}

main();
