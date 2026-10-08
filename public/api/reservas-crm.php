<?php
/**
 * CRM de Seguimiento de Clientes para Casa Rojo del Tiétar (cPanel / Apache)
 * - Lista todas las solicitudes reales guardadas en api/data/reservas.json
 * - Permite disparar con 1 clic desde /keystatic (o por cron diario automático):
 *   a) Email Fase 2: Guía Pre-Llegada (48h antes del check-in)
 *   b) Email Fase 3: Cierre Post-Estancia + Devolución de Fianza (100 €) + Fidelización
 */
header('Content-Type: application/json; charset=utf-8');

$expectedHash = '05c0dd5a33807e1ab100a7261cbc62995272356d36d7f362cd83eaf7ce806b4e';
$ownerEmail = 'casarural@rojodeltietar.com';
$logFile = __DIR__ . '/data/reservas.json';

function loadLeads(string $file): array {
    if (!file_exists($file)) return [];
    $data = json_decode(file_get_contents($file), true);
    return is_array($data) ? $data : [];
}

function saveLeads(string $file, array $leads): void {
    $dir = dirname($file);
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
        @file_put_contents($dir . '/.htaccess', "Deny from all\n");
    }
    @file_put_contents($file, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function sendPreArrivalMail(array $lead, string $ownerEmail): bool {
    $email = $lead['email'] ?? '';
    if ($email === '') return false;
    $firstName = explode(' ', trim($lead['nombre'] ?? 'Hola'))[0];
    $llegada = $lead['llegada'] ?? '';
    $huespedes = $lead['huespedes'] ?? 10;

    $subject = "Todo listo en La Iglesuela para el $llegada · Cómo llegar y detalles de entrada";
    $html = "
    <html><body style='font-family:Arial,sans-serif;color:#2c2926;background:#f4f0ea;padding:24px;'>
      <div style='max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e2d9ce;'>
        <div style='background:#59614e;color:#fff;padding:24px 32px;'>
          <div style='font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#e4ebe0;font-weight:bold;'>48 Horas antes de vuestra llegada · Casa Rojo del Tiétar</div>
          <h2 style='margin:6px 0 0 0;font-family:Georgia,serif;font-weight:normal;'>Hola, $firstName. Ya estamos preparando la casa para recibiros.</h2>
        </div>
        <div style='padding:28px 32px;font-size:15px;line-height:1.7;'>
          <p>Ya queda muy poco para vuestra llegada el <strong>$llegada</strong>. Te escribimos para dejarte a mano las indicaciones prácticas para el viaje de los $huespedes:</p>
          <ul style='padding-left:18px;'>
            <li><strong>Ubicación exacta y aparcamiento:</strong> estamos en <em>Paraje el Carrascal, s/n (45633 La Iglesuela del Tiétar, Toledo)</em>, justo al lado de la pradera pública sin tráfico. Podéis aparcar en la misma puerta.</li>
            <li><strong>Entrega de llaves (desde las 17:00h):</strong> avísanos por WhatsApp al <strong>605 935 487</strong> unos 30 minutos antes de llegar para recibiros en la puerta sin esperas.</li>
            <li><strong>Casa caldeada, leña y desayuno listo:</strong> encendemos el suelo radiante con antelación, tenéis la leña de encina lista en salón y barbacoa, y toda la despensa de desayuno repuesta (café en grano recién molido, huevos, pan, leche, fruta y bizcocho casero).</li>
            <li><strong>¿Encargamos comida casera o cochifrito?:</strong> si queréis que os dejemos encargado el cochifrito tradicional o asado local, decídnoslo hoy o mañana para avisar en cocina.</li>
          </ul>
          <p style='margin-top:22px;'>¡Buen viaje a todos y nos vemos en La Iglesuela!<br>
          <strong style='color:#703829;'>Casa Rojo del Tiétar · 605 935 487</strong></p>
        </div>
      </div>
    </body></html>";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Casa Rojo del Tietar <$ownerEmail>\r\n";
    $headers .= "Reply-To: Casa Rojo del Tietar <$ownerEmail>\r\n";
    return @mail($email, $subject, $html, $headers);
}

function sendPostStayMail(array $lead, string $ownerEmail): bool {
    $email = $lead['email'] ?? '';
    if ($email === '') return false;
    $firstName = explode(' ', trim($lead['nombre'] ?? 'Hola'))[0];

    $subject = "Gracias por cuidar la casa, $firstName · Devolución de fianza (100 €) y hasta pronto";
    $html = "
    <html><body style='font-family:Arial,sans-serif;color:#2c2926;background:#f4f0ea;padding:24px;'>
      <div style='max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e2d9ce;'>
        <div style='background:#703829;color:#fff;padding:24px 32px;'>
          <div style='font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#ffb4a0;font-weight:bold;'>Post-Estancia y Devolución de Fianza · Casa Rojo del Tiétar</div>
          <h2 style='margin:6px 0 0 0;font-family:Georgia,serif;font-weight:normal;'>Un placer haberos tenido en casa, $firstName.</h2>
        </div>
        <div style='padding:28px 32px;font-size:15px;line-height:1.7;'>
          <p>Esperamos que el viaje de vuelta haya ido muy bien. Queríamos daros las gracias a todo el grupo por elegir <strong>Casa Rojo del Tiétar</strong> y, sobre todo, por el cuidado con el que habéis tratado la casa.</p>
          <div style='background:#f3f6f1;border:1px solid #cad6c3;border-radius:10px;padding:16px 20px;margin:18px 0;font-size:14px;'>
            <strong style='color:#3c4433;'>✓ Devolución íntegra de la fianza (100,00 €) ordenada:</strong><br>
            Revisada la vivienda tras vuestra salida y estando todo en perfecto estado, ya hemos ordenado el reintegro de vuestros <strong>100,00 € de fianza</strong>.
          </div>
          <div style='background:#fff8f5;border:1px solid #eadcd5;border-radius:10px;padding:16px 20px;margin:18px 0;font-size:14px;'>
            <strong style='color:#703829;'>Para cuando os apetezca repetir (Trato de Amigos de la Casa):</strong><br>
            En vuestra próxima escapada, reservando directamente con nosotros (indicando que ya habéis estado), tenéis <strong>salida flexible prioritaria (late check-out sin coste)</strong> y detalle de bienvenida de la comarca.
          </div>
          <p>Un abrazo de parte de tus anfitriones en La Iglesuela del Tiétar,<br>
          <strong style='color:#703829;'>Casa Rojo del Tiétar · casarural@rojodeltietar.com</strong></p>
        </div>
      </div>
    </body></html>";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Casa Rojo del Tietar <$ownerEmail>\r\n";
    $headers .= "Reply-To: Casa Rojo del Tietar <$ownerEmail>\r\n";
    return @mail($email, $subject, $html, $headers);
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true) ?: [];
$token = $_SERVER['HTTP_X_CMS_TOKEN'] ?? ($body['authToken'] ?? ($_GET['authToken'] ?? ''));

if (!hash_equals($expectedHash, (string)$token)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}

$leads = loadLeads($logFile);
$action = $body['action'] ?? ($_GET['action'] ?? 'list');

if ($action === 'send_stage') {
    $leadId = $body['leadId'] ?? '';
    $stage = $body['stage'] ?? '';
    $sent = false;

    foreach ($leads as &$lead) {
        if (($lead['id'] ?? '') === $leadId) {
            if ($stage === 'pre_arrival') {
                $sent = sendPreArrivalMail($lead, $ownerEmail);
                $lead['preArrivalSentAt'] = date('c');
            } elseif ($stage === 'post_stay') {
                $sent = sendPostStayMail($lead, $ownerEmail);
                $lead['postStaySentAt'] = date('c');
            }
            break;
        }
    }
    unset($lead);
    saveLeads($logFile, $leads);
    echo json_encode(['ok' => true, 'sent' => $sent, 'leads' => $leads]);
    exit;
}

echo json_encode(['ok' => true, 'leads' => $leads]);
