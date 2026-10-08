export interface ReservationLead {
  id: string;
  createdAt: string;
  nombre: string;
  email: string;
  telefono: string;
  llegada: string;
  salida: string;
  huespedes: number;
  noches: number;
  nochesFinde: number;
  nochesSemana: number;
  supletorias: number;
  totalEstimado: number;
  senal25: number;
  fianza: number;
  precioPorPersonaNoche: string;
  mascota: boolean;
  interesCatering: boolean;
  mensaje: string;
  origenFormulario: string;
}

export function calculateReservationQuote(params: {
  nombre: string;
  email: string;
  telefono: string;
  llegada: string;
  salida: string;
  huespedes?: number | string;
  mensaje?: string;
  mascota?: boolean;
  interesCatering?: boolean;
  origenFormulario?: string;
}): ReservationLead {
  const start = new Date(params.llegada);
  const end = new Date(params.salida);
  const diffDays = Math.max(2, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 2);

  let guestCount = 10;
  if (typeof params.huespedes === 'number') {
    guestCount = params.huespedes;
  } else if (typeof params.huespedes === 'string') {
    const match = params.huespedes.match(/\d+/);
    guestCount = match ? parseInt(match[0], 10) : 10;
  }
  guestCount = Math.min(13, Math.max(2, guestCount));

  let nochesFinde = 0;
  let nochesSemana = 0;
  let baseTotal = 0;
  const cur = new Date(start);

  for (let i = 0; i < diffDays; i++) {
    const day = cur.getDay(); // 5 = Viernes, 6 = Sábado
    const month = cur.getMonth(); // 7 = Agosto
    if (day === 5 || day === 6 || month === 7) {
      nochesFinde++;
      baseTotal += 375;
    } else {
      nochesSemana++;
      baseTotal += 200;
    }
    cur.setDate(cur.getDate() + 1);
  }

  if (diffDays === 7 && baseTotal > 1400) {
    baseTotal = 1400; // Promo Semana Completa
  }

  const supletorias = Math.max(0, guestCount - 10);
  const costeSupletorias = supletorias * 10 * diffDays;
  const totalEstimado = baseTotal + costeSupletorias;
  const senal25 = Math.round(totalEstimado * 0.25 * 100) / 100;
  const fianza = 100;
  const precioPorPersonaNoche = (totalEstimado / (guestCount * diffDays)).toFixed(2).replace('.', ',');

  const id = `RT-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;

  return {
    id,
    createdAt: new Date().toISOString(),
    nombre: params.nombre.trim(),
    email: params.email.trim(),
    telefono: params.telefono.trim(),
    llegada: params.llegada,
    salida: params.salida,
    huespedes: guestCount,
    noches: diffDays,
    nochesFinde,
    nochesSemana,
    supletorias,
    totalEstimado,
    senal25,
    fianza,
    precioPorPersonaNoche,
    mascota: Boolean(params.mascota || (params.mensaje && /perr|mascot|gat/i.test(params.mensaje))),
    interesCatering: Boolean(params.interesCatering || (params.mensaje && /catering|cochifrito|asad|comid|paell/i.test(params.mensaje))),
    mensaje: (params.mensaje || '').trim(),
    origenFormulario: params.origenFormulario || 'Formulario de Reserva Directa Web',
  };
}

function formatDateEs(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * 1. EMAIL PARA EL PROPIETARIO (casarural@rojodeltietar.com)
 * Operativo, directo, con presupuesto ya calculado, datos del huésped y botones de respuesta rápida en 1 clic.
 */
export function buildOwnerEmail(lead: ReservationLead) {
  const firstName = lead.nombre.split(' ')[0];
  const fechaEntradaTexto = formatDateEs(lead.llegada);
  const fechaSalidaTexto = formatDateEs(lead.salida);
  const telClean = lead.telefono.replace(/\s+/g, '');

  const replySubject = encodeURIComponent(`Confirmación de disponibilidad en Casa Rojo del Tiétar (${lead.llegada} al ${lead.salida})`);
  const replyBody = encodeURIComponent(
`Hola ${firstName},

Te escribo desde Casa Rojo del Tiétar. Tenemos disponibilidad para las fechas que nos solicitas (${fechaEntradaTexto} al ${fechaSalidaTexto}, ${lead.noches} noches para ${lead.huespedes} personas).

Como viste en el resumen, el importe total con el desayuno de todos los días y las ${lead.supletorias} camas supletorias incluidas es de ${lead.totalEstimado} €.

Para dejaros las fechas bloqueadas en firme, solo es necesario abonar el 25% de señal (${lead.senal25} €) mediante transferencia o Bizum, que recuerda que es 100% reembolsable hasta 7 días antes de vuestra llegada.

Dime si os cuadra para pasarte el número de cuenta y bloqueároslo hoy mismo.

Un saludo,
Casa Rojo del Tiétar
Tel. 605 935 487`
  );

  const waReplyText = encodeURIComponent(
    `Hola ${firstName}, soy de Casa Rojo del Tiétar. Acabo de recibir tu solicitud web para el fin de semana del ${lead.llegada} al ${lead.salida} (${lead.huespedes} personas). Tenemos la casa disponible para esas fechas.`
  );

  const subject = `[Nueva Solicitud Web #${lead.id}] ${lead.nombre} · ${lead.llegada} a ${lead.salida} (${lead.huespedes} pers. · ${lead.totalEstimado} €)`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f0ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1b1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f0ea;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2d9ce;">
          <!-- Header -->
          <tr>
            <td style="background-color:#703829;padding:24px 32px;color:#ffffff;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#ffb4a0;font-weight:700;margin-bottom:6px;">
                Aviso Interno · Recepción de Reservas (${lead.origenFormulario})
              </div>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:700;color:#ffffff;">
                Nueva Solicitud de Reserva: ${lead.nombre}
              </h1>
              <div style="margin-top:6px;font-size:13px;color:#ffdbd1;">
                Referencia: <strong>#${lead.id}</strong> · Destino: <strong>casarural@rojodeltietar.com</strong>
              </div>
            </td>
          </tr>

          <!-- Quick Action Buttons for Host -->
          <tr>
            <td style="background-color:#fff8f5;padding:20px 32px;border-bottom:1px solid #ece3d8;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#703829;margin-bottom:12px;">
                Acciones Rápidas (1 Clic):
              </div>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-right:8px;padding-bottom:8px;">
                    <a href="mailto:${lead.email}?subject=${replySubject}&body=${replyBody}" style="display:inline-block;background-color:#703829;color:#ffffff;text-decoration:none;padding:11px 18px;border-radius:8px;font-size:13px;font-weight:700;">
                      ✉️ Confirmar Disponibilidad por Email
                    </a>
                  </td>
                  <td style="padding-right:8px;padding-bottom:8px;">
                    <a href="https://wa.me/34${telClean.replace(/^\+?34/, '')}?text=${waReplyText}" style="display:inline-block;background-color:#25D366;color:#111111;text-decoration:none;padding:11px 18px;border-radius:8px;font-size:13px;font-weight:700;">
                      💬 Abrir WhatsApp con ${firstName}
                    </a>
                  </td>
                  <td style="padding-bottom:8px;">
                    <a href="tel:${telClean}" style="display:inline-block;background-color:#59614e;color:#ffffff;text-decoration:none;padding:11px 16px;border-radius:8px;font-size:13px;font-weight:700;">
                      📞 Llamar (${lead.telefono})
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Guest & Stay Details -->
          <tr>
            <td style="padding:28px 32px;">
              <h2 style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:19px;color:#1c1b1a;border-bottom:1px solid #eee;padding-bottom:8px;">
                1. Datos del Cliente y Fechas Solicitadas
              </h2>
              <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;line-height:1.5;">
                <tr>
                  <td width="38%" style="color:#6b635b;font-weight:600;">Cliente:</td>
                  <td style="font-weight:700;color:#1c1b1a;">${lead.nombre}</td>
                </tr>
                <tr>
                  <td style="color:#6b635b;font-weight:600;">Email (Reply-To activo):</td>
                  <td><a href="mailto:${lead.email}" style="color:#703829;font-weight:700;">${lead.email}</a></td>
                </tr>
                <tr>
                  <td style="color:#6b635b;font-weight:600;">Teléfono / WhatsApp:</td>
                  <td><a href="tel:${telClean}" style="color:#1c1b1a;font-weight:700;text-decoration:none;">${lead.telefono}</a></td>
                </tr>
                <tr>
                  <td style="color:#6b635b;font-weight:600;">Llegada (Check-in 17:00h):</td>
                  <td style="font-weight:700;color:#703829;">${fechaEntradaTexto}</td>
                </tr>
                <tr>
                  <td style="color:#6b635b;font-weight:600;">Salida (Check-out 14:00h):</td>
                  <td style="font-weight:700;color:#703829;">${fechaSalidaTexto} (${lead.noches} noches)</td>
                </tr>
                <tr>
                  <td style="color:#6b635b;font-weight:600;">Tamaño del grupo:</td>
                  <td><strong>${lead.huespedes} personas</strong> (${lead.supletorias > 0 ? `10 plazas en las 5 suites + ${lead.supletorias} supletorias` : '10 plazas en las 5 suites'})</td>
                </tr>
                <tr>
                  <td style="color:#6b635b;font-weight:600;">Etiquetas detectadas:</td>
                  <td>
                    <span style="display:inline-block;padding:3px 9px;border-radius:4px;font-size:12px;font-weight:600;background:#ece7e1;margin-right:6px;">
                      Mascota: ${lead.mascota ? 'SÍ (Preparar patio)' : 'No indicada'}
                    </span>
                    <span style="display:inline-block;padding:3px 9px;border-radius:4px;font-size:12px;font-weight:600;background:#dde6cd;color:#171e0f;">
                      Catering/Asado: ${lead.interesCatering ? 'SÍ (Enviar carta asador)' : 'Pendiente de ofrecer'}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Guest Message -->
              <div style="margin-top:20px;padding:16px;background-color:#faf7f2;border-left:4px solid #703829;border-radius:6px;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#703829;margin-bottom:6px;">
                  Mensaje escrito por ${lead.nombre}:
                </div>
                <div style="font-size:14px;color:#2c2926;line-height:1.6;">
                  "${lead.mensaje || 'Sin comentarios adicionales.'}"
                </div>
              </div>

              <!-- Pre-calculated Financial Breakdown -->
              <h2 style="margin:28px 0 14px 0;font-family:Georgia,serif;font-size:19px;color:#1c1b1a;border-bottom:1px solid #eee;padding-bottom:8px;">
                2. Desglose Económico Enviado al Cliente
              </h2>
              <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px;background-color:#fff8f5;border-radius:10px;border:1px solid #eadcd5;">
                ${lead.nochesFinde > 0 ? `
                <tr>
                  <td>Noches fin de semana / temporada alta (${lead.nochesFinde} × 375 €)</td>
                  <td align="right" style="font-weight:700;">${lead.nochesFinde * 375} €</td>
                </tr>` : ''}
                ${lead.nochesSemana > 0 ? `
                <tr>
                  <td>Noches domingo a jueves (${lead.nochesSemana} × 200 €)</td>
                  <td align="right" style="font-weight:700;">${lead.nochesSemana * 200} €</td>
                </tr>` : ''}
                ${lead.supletorias > 0 ? `
                <tr>
                  <td>Camas supletorias con juego de toallas (${lead.supletorias} × 10 € × ${lead.noches} noches)</td>
                  <td align="right" style="font-weight:700;">${lead.supletorias * 10 * lead.noches} €</td>
                </tr>` : ''}
                <tr>
                  <td>Desayuno mediterráneo diario, leña de encina y suministros</td>
                  <td align="right" style="color:#59614e;font-weight:700;">Incluido (0 €)</td>
                </tr>
                <tr style="border-top:1px solid #decbc2;font-size:16px;">
                  <td style="font-weight:700;color:#703829;">Total Estancia (${lead.precioPorPersonaNoche} € / pers. y noche)</td>
                  <td align="right" style="font-weight:800;color:#703829;">${lead.totalEstimado} €</td>
                </tr>
                <tr>
                  <td style="color:#6b635b;font-size:13px;">Señal para bloquear fechas (25% · reembolsable hasta 7 días antes)</td>
                  <td align="right" style="font-weight:700;font-size:13px;">${lead.senal25} €</td>
                </tr>
                <tr>
                  <td style="color:#6b635b;font-size:13px;">Resto a la entrega de llaves + Fianza reembolsable (${lead.fianza} €)</td>
                  <td align="right" style="font-weight:700;font-size:13px;">${lead.totalEstimado - lead.senal25} € + ${lead.fianza} €</td>
                </tr>
              </table>

              <!-- Automated Follow-up Pipeline -->
              <h2 style="margin:28px 0 12px 0;font-family:Georgia,serif;font-size:19px;color:#1c1b1a;border-bottom:1px solid #eee;padding-bottom:8px;">
                3. Secuencia de Seguimiento Activada para este Huésped
              </h2>
              <ul style="margin:0;padding-left:18px;font-size:13px;color:#4a4540;line-height:1.7;">
                <li><strong>Paso 1 (Enviado ahora mismo a ${lead.email}):</strong> Acuse de recibo con el resumen de qué incluye la casa (desayuno con café en grano, leña preparada, 5 suites con baño) y el presupuesto desglosado.</li>
                <li><strong>Paso 2 (Si en 24h no ha respondido tras enviarle disponibilidad):</strong> Toque breve por WhatsApp/Email preguntando si el grupo ha podido ver el presupuesto o si necesitan ajustar número de camas.</li>
                <li><strong>Paso 3 (48h antes de la llegada — Pre-Check-in):</strong> Envío automático de ubicación exacta para aparcar en la puerta, consulta de hora de llegada para encender antes el suelo radiante y tener listo el bizcocho casero, y opción de encargar asado/cochifrito.</li>
                <li><strong>Paso 4 (24h después de la salida — Post-Estancia):</strong> Aviso de devolución de los 100 € de fianza, agradecimiento directo y ventaja para repetir (supletorias gratis o salida flexible el domingo por la tarde en su próxima visita).</li>
              </ul>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

/**
 * 2. EMAIL 1 AL CLIENTE (Inmediato tras enviar el formulario)
 * Tono: Anfitrión rural de verdad, cálido, detallista y práctico, CERO cursi ni ñoño.
 */
export function buildClientImmediateEmail(lead: ReservationLead) {
  const firstName = lead.nombre.split(' ')[0];
  const fechaEntradaTexto = formatDateEs(lead.llegada);
  const fechaSalidaTexto = formatDateEs(lead.salida);

  const subject = `Tu solicitud en Casa Rojo del Tiétar (${lead.llegada} al ${lead.salida}) · Resumen y detalles prácticos`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f0ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1b1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f0ea;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2d9ce;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1c1b1a;padding:28px 36px;border-bottom:4px solid #703829;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#ffb4a0;font-weight:700;margin-bottom:6px;">
                Casa Rojo del Tiétar · La Iglesuela del Tiétar (Toledo)
              </div>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#ffffff;">
                Hola, ${firstName}. Hemos recibido tu consulta.
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px;font-size:15px;line-height:1.7;color:#2c2926;">
              <p style="margin-top:0;">
                Acabamos de recibir tu solicitud para venir a <strong>Casa Rojo del Tiétar</strong> desde el <strong>${fechaEntradaTexto}</strong> hasta el <strong>${fechaSalidaTexto}</strong> (${lead.noches} noches) para un grupo de <strong>${lead.huespedes} personas</strong>.
              </p>
              <p>
                Revisamos el calendario ahora mismo y te confirmamos personalmente en muy poco tiempo (por este mismo correo o al <strong>${lead.telefono}</strong>).
              </p>
              <p>
                Como sabemos que organizar una escapada para ${lead.huespedes} personas lleva su trabajo, te dejamos aquí un resumen claro y al grano de cómo está pensada la casa y qué tenéis ya incluido para que lo puedas compartir con el grupo:
              </p>

              <!-- What makes the house practical & special without being cheesy -->
              <div style="background-color:#fff8f5;border:1px solid #eadcd5;border-radius:12px;padding:22px 24px;margin:24px 0;">
                <h2 style="margin:0 0 14px 0;font-family:Georgia,serif;font-size:18px;color:#703829;">
                  Lo que ya tenéis preparado al llegar a la casa
                </h2>
                <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.75;color:#2c2926;">
                  <li style="margin-bottom:10px;">
                    <strong>Cada pareja o familia con su propio baño:</strong> Las <strong>5 habitaciones son tipo suite con baño completo privado</strong> dentro del dormitorio (dos de ellas con bañera exenta además de ducha, y una en planta baja adaptada a movilidad reducida). Nadie tiene que esperar turno por la mañana, y además contáis con un sexto aseo en el salón.
                  </li>
                  <li style="margin-bottom:10px;">
                    <strong>El desayuno de todos los días corre de nuestra cuenta:</strong> No hace falta que vengáis el primer día cargados del supermercado para el desayuno del día siguiente. En la cocina os dejamos <strong>café en grano recién molido</strong> (en cafetera automática), leche, Cola Cao, huevos, pan para tostar, aceite de oliva virgen extra, tomate, mantequilla, mermelada, fruta variada y un <strong>bizcocho casero recién hecho</strong>.
                  </li>
                  <li style="margin-bottom:10px;">
                    <strong>Casa caldeada y leña de encina sin coste extra:</strong> Horas antes de que lleguéis ponemos en marcha el suelo radiante para que encontréis los 240 m² a buena temperatura. La leña de encina está incluida gratis tanto para la <strong>chimenea del salón (68,60 m²)</strong> como para la <strong>barbacoa del patio privado</strong>.
                  </li>
                  ${lead.mascota ? `
                  <li style="margin-bottom:10px;">
                    <strong>Vuestra mascota es bienvenida:</strong> El patio exterior de 90 m² está completamente amurallado en piedra (seguro para que no salga a la calle) y justo al salir por la puerta tenéis una gran pradera pública sin tráfico para pasear.
                  </li>` : ''}
                  <li style="margin-bottom:0;">
                    <strong>Si un día no os apetece cocinar para ${lead.huespedes}:</strong> Trabajamos con asadores tradicionales de aquí de La Iglesuela que os llevan a la casa un buen <strong>cochifrito tradicional, asado o paella</strong> a precio de pueblo. Si os cuadra para el sábado a mediodía, dínoslo antes de venir y os lo dejamos encargado.
                  </li>
                </ul>
              </div>

              <!-- Price Box -->
              <h2 style="margin:28px 0 12px 0;font-family:Georgia,serif;font-size:19px;color:#1c1b1a;">
                Presupuesto orientativo de vuestra estancia (Ref. #${lead.id})
              </h2>
              <table width="100%" cellpadding="9" cellspacing="0" style="font-size:14px;background-color:#faf7f2;border-radius:10px;border:1px solid #e2d9ce;">
                ${lead.nochesFinde > 0 ? `
                <tr>
                  <td>Alquiler íntegro fin de semana / verano (${lead.nochesFinde} noches × 375 €)</td>
                  <td align="right" style="font-weight:700;">${lead.nochesFinde * 375} €</td>
                </tr>` : ''}
                ${lead.nochesSemana > 0 ? `
                <tr>
                  <td>Alquiler íntegro domingo a jueves (${lead.nochesSemana} noches × 200 €)</td>
                  <td align="right" style="font-weight:700;">${lead.nochesSemana * 200} €</td>
                </tr>` : ''}
                ${lead.supletorias > 0 ? `
                <tr>
                  <td>${lead.supletorias} camas supletorias de 90 cm con juego de toallas (10 €/cama y noche)</td>
                  <td align="right" style="font-weight:700;">${lead.supletorias * 10 * lead.noches} €</td>
                </tr>` : ''}
                <tr>
                  <td>Desayuno diario completo (${lead.huespedes} pers.), leña de encina, ropa de cama y baño</td>
                  <td align="right" style="color:#59614e;font-weight:700;">Incluido</td>
                </tr>
                <tr style="border-top:2px solid #d5c8b8;font-size:16px;">
                  <td style="font-weight:700;color:#703829;">Total Estancia (IVA incluido)</td>
                  <td align="right" style="font-weight:800;color:#703829;">${lead.totalEstimado} € <span style="font-size:12px;font-weight:600;color:#59614e;">(${lead.precioPorPersonaNoche} € / pers. y noche)</span></td>
                </tr>
              </table>

              <p style="font-size:13px;color:#5a534c;margin-top:14px;line-height:1.6;">
                <strong>Condiciones claras y sin letra pequeña:</strong> Para bloquear las fechas se abona un <strong>25% de señal (${lead.senal25} €)</strong>, que es <strong>100% reembolsable</strong> si tuvierais que cancelar hasta 7 días antes de la entrada. El resto (${lead.totalEstimado - lead.senal25} €) se abona a la entrega de llaves junto con una fianza de ${lead.fianza} € que os devolvemos tras revisar la casa. Entrada desde las 17:00h y salida hasta las 14:00h (si el domingo no entra otro grupo y os viene bien salir un poco más tarde tras comer sin prisas, dínoslo y os damos facilidades).
              </p>

              <p style="margin-top:24px;">
                Si quieres comentarnos cualquier detalle antes de que te llamemos, puedes responder directamente a este correo o escribirnos por WhatsApp al <strong>605 935 487</strong>.
              </p>

              <p style="margin-bottom:0;margin-top:24px;">
                Un saludo desde La Iglesuela del Tiétar,<br />
                <strong style="color:#703829;">Casa Rojo del Tiétar</strong><br />
                <span style="font-size:13px;color:#6b635b;">Paraje el Carrascal, s/n · 45633 La Iglesuela del Tiétar (Toledo)<br />Tel. 605 935 487 / 607 438 345 · casarural@rojodeltietar.com</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

/**
 * 3. EMAIL 2 DE SEGUIMIENTO: PRE-LLEGADA (48 HORAS ANTES DEL CHECK-IN)
 * Detalles prácticos de llegada, calefacción encendida, bizcocho recién hecho, encargo de pan/asado y dónde aparcar.
 */
export function buildPreArrivalEmail(lead: ReservationLead) {
  const firstName = lead.nombre.split(' ')[0];
  const subject = `Todo a punto en La Iglesuela para este viernes, ${firstName} · Indicaciones prácticas`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f0ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1b1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f0ea;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2d9ce;">
          <tr>
            <td style="background-color:#59614e;padding:26px 36px;color:#ffffff;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#dde6cd;font-weight:700;margin-bottom:6px;">
                Seguimiento Pre-Estancia (48h antes de la llegada)
              </div>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#ffffff;">
                Preparando la casa para el viernes, ${firstName}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 36px;font-size:15px;line-height:1.7;color:#2c2926;">
              <p style="margin-top:0;">
                Hola, ${firstName}:
              </p>
              <p>
                Ya queda nada para que vengáis este viernes a <strong>Casa Rojo del Tiétar</strong>. Te escribo con tres cosas muy concretas para que el viaje y la llegada con los coches os resulten cómodos:
              </p>

              <ol style="padding-left:20px;line-height:1.8;">
                <li style="margin-bottom:12px;">
                  <strong>¿A qué hora calculáis llegar el viernes?</strong><br />
                  La entrada es a partir de las 17:00h (y si llegáis más tarde porque salís de trabajar de Madrid con algo de tráfico en la A-5 / M-501, no hay ningún problema). Solo dinos una hora aproximada por WhatsApp para tener la temperatura del suelo radiante a punto y recibiros en la puerta sin que tengáis que esperar.
                </li>
                <li style="margin-bottom:12px;">
                  <strong>Cómo entrar con los coches y dónde aparcar:</strong><br />
                  Estamos en el <em>Paraje el Carrascal, s/n</em>, junto al parque/pradera de El Ejido. Hay sitio de sobra para aparcar todos los coches en la misma puerta de la casa sin meteros por las calles más estrechas del centro del pueblo. Te dejamos aquí el punto exacto de Google Maps: <a href="https://www.google.com/maps?q=40.2336,-4.7492" style="color:#703829;font-weight:700;">Abrir ubicación exacta de la puerta</a>.
                </li>
                <li style="margin-bottom:12px;">
                  <strong>Lo que NO necesitáis traer en el maletero:</strong><br />
                  Recordad que tenéis en los 5 baños toallas, secador de pelo, gel, champú y crema hidratante; en la cocina tenéis pastillas de lavavajillas, papel, aceite, sal, café en grano en la cafetera y todo el desayuno de los días que estéis (leche, huevos, pan, fruta, mantequilla, mermelada y el bizcocho casero). Y la leña para la chimenea y la barbacoa ya está apilada y lista.
                </li>
              </ol>

              <div style="background-color:#fff8f5;border-left:4px solid #703829;padding:16px 20px;border-radius:6px;margin:20px 0;font-size:14px;">
                <strong>¿Queréis que os dejemos encargado pan de leña o comida para el sábado?</strong><br />
                Si el sábado queréis hacer barbacoa os podemos recomendar la carnicería del pueblo, o si preferís que os traigan hecho el cochifrito o un asado para los ${lead.huespedes}, avísanos entre hoy y mañana y nos ocupamos de encargarlo.
              </div>

              <p style="margin-bottom:0;">
                Buen viaje el viernes y nos vemos aquí en La Iglesuela.<br /><br />
                Un saludo,<br />
                <strong style="color:#703829;">Casa Rojo del Tiétar</strong> · Tel. / WhatsApp: <strong>605 935 487</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

/**
 * 4. EMAIL 3 DE SEGUIMIENTO: POST-ESTANCIA Y DEVOLUCIÓN DE FIANZA (24H TRAS EL CHECK-OUT)
 * Cierre impecable: confirma devolución de los 100€ de fianza sin que el cliente tenga que reclamarlos, agradece el cuidado de la casa y da un privilegio real para repetir.
 */
export function buildPostStayEmail(lead: ReservationLead) {
  const firstName = lead.nombre.split(' ')[0];
  const subject = `Devolución de vuestra fianza (100 €) y gracias por la visita, ${firstName}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f0ea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1b1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f0ea;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2d9ce;">
          <tr>
            <td style="background-color:#703829;padding:26px 36px;color:#ffffff;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#ffb4a0;font-weight:700;margin-bottom:6px;">
                Seguimiento Post-Estancia · Cierre de Fianza
              </div>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#ffffff;">
                Gracias por cuidar la casa como si fuera vuestra, ${firstName}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 36px;font-size:15px;line-height:1.7;color:#2c2926;">
              <p style="margin-top:0;">
                Hola, ${firstName}:
              </p>
              <p>
                Esperamos que tuvierais buena vuelta a casa ayer domingo. Te escribo para confirmarte que tras revisar la casa todo ha quedado en perfecto estado y <strong>ya hemos ordenado la devolución íntegra de vuestra fianza de 100 €</strong>. Da gusto recibir a grupos así.
              </p>
              <p>
                Ojalá hayáis descansado bien, os haya gustado el desayuno y hayáis disfrutado del patio, la chimenea y el entorno de La Iglesuela.
              </p>

              <div style="background-color:#faf7f2;border:1px solid #e2d9ce;border-radius:12px;padding:20px 24px;margin:24px 0;">
                <h2 style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:18px;color:#703829;">
                  Para cuando os apetezca volver a juntaros
                </h2>
                <p style="margin:0;font-size:14px;color:#3d3834;line-height:1.65;">
                  A los grupos que cuidáis así la casa os guardamos siempre trato directo de anfitrión: la próxima vez que queráis escaparos al Valle del Tiétar (tengáis o no las mismas plazas), escríbenos directamente a este correo o al 605 935 487 y <strong>las camas supletorias que necesitéis corren de nuestra cuenta (0 €)</strong>, además de dejaros salida flexible por la tarde el domingo sin suplemento.
                </p>
              </div>

              <p style="font-size:14px;color:#4a4540;">
                Si tenéis un minuto y os apetece contar vuestra experiencia en Google o recomendarnos a amigos que busquen una casa amplia cerca de Madrid donde cada pareja tenga su baño privado, nos ayudáis muchísimo.
              </p>

              <p style="margin-bottom:0;margin-top:24px;">
                Un abrazo para todo el grupo y hasta la próxima,<br />
                <strong style="color:#703829;">Equipo de Casa Rojo del Tiétar</strong><br />
                <span style="font-size:13px;color:#6b635b;">casarural@rojodeltietar.com · 605 935 487</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
