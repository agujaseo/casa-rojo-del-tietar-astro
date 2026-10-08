<?php
/**
 * Endpoint nativo para cPanel / Apache (public_html/api/reserva.php)
 * Envía:
 * 1) Aviso interno completo con presupuesto y botones 1-clic a casarural@rojodeltietar.com
 * 2) Confirmación cálida, práctica y detallada al huésped
 * 3) Guarda registro de seguimiento en api/data/reservas.json
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    $data = $_POST;
}

$nombre = trim($data['nombre'] ?? '');
$email = trim($data['email'] ?? '');
$telefono = trim($data['telefono'] ?? '');
$llegada = trim($data['llegada'] ?? '');
$salida = trim($data['salida'] ?? '');
$huespedesRaw = $data['huespedes'] ?? '10';
$mensaje = trim($data['mensaje'] ?? '');
$origen = trim($data['origenFormulario'] ?? 'Formulario Web Casa Rojo del Tiétar');

if ($nombre === '' || $telefono === '' || $llegada === '' || $salida === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Por favor completa nombre, teléfono y fechas.']);
    exit;
}

preg_match('/\d+/', (string)$huespedesRaw, $matches);
$huespedes = isset($matches[0]) ? max(2, min(13, (int)$matches[0])) : 10;

$start = strtotime($llegada);
$end = strtotime($salida);
$noches = max(2, (int)round(($end - $start) / 86400));

$nochesFinde = 0;
$nochesSemana = 0;
$baseTotal = 0;
for ($i = 0; $i < $noches; $i++) {
    $cur = strtotime("+$i days", $start);
    $dow = (int)date('w', $cur); // 5=Vie, 6=Sab
    $month = (int)date('n', $cur); // 8=Agosto
    if ($dow === 5 || $dow === 6 || $month === 8) {
        $nochesFinde++;
        $baseTotal += 375;
    } else {
        $nochesSemana++;
        $baseTotal += 200;
    }
}
if ($noches === 7 && $baseTotal > 1400) {
    $baseTotal = 1400;
}

$supletorias = max(0, $huespedes - 10);
$costeSupletorias = $supletorias * 10 * $noches;
$totalEstimado = $baseTotal + $costeSupletorias;
$senal25 = round($totalEstimado * 0.25, 2);
$fianza = 100;
$precioPersonaNoche = number_format($totalEstimado / ($huespedes * $noches), 2, ',', '.');
$refId = 'RT-' . date('Y') . '-' . rand(1000, 9999);

$ownerEmail = 'casarural@rojodeltietar.com';
$firstName = explode(' ', $nombre)[0];

// 1. Email para casarural@rojodeltietar.com
$ownerSubject = "[Nueva Solicitud Web #$refId] $nombre · $llegada a $salida ($huespedes pers. · $totalEstimado €)";
$ownerHtml = "
<html><body style='font-family:Arial,sans-serif;color:#1c1b1a;background:#f4f0ea;padding:24px;'>
  <div style='max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e2d9ce;'>
    <div style='background:#703829;color:#fff;padding:22px 28px;'>
      <div style='font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#ffb4a0;font-weight:bold;'>Aviso Interno · $origen</div>
      <h2 style='margin:6px 0 0 0;font-family:Georgia,serif;'>Nueva Solicitud: $nombre (#$refId)</h2>
    </div>
    <div style='padding:24px 28px;font-size:14px;line-height:1.6;'>
      <p><strong>Cliente:</strong> $nombre<br>
      <strong>Email:</strong> <a href='mailto:$email'>$email</a><br>
      <strong>Teléfono / WhatsApp:</strong> <a href='tel:$telefono'>$telefono</a><br>
      <strong>Fechas:</strong> Entrada $llegada (17:00h) · Salida $salida (14:00h) ($noches noches)<br>
      <strong>Grupo:</strong> $huespedes personas ($supletorias camas supletorias)<br>
      <strong>Presupuesto calculado:</strong> <strong>$totalEstimado €</strong> (Señal 25%: $senal25 € · Fianza: $fianza €)</p>
      <div style='background:#faf7f2;border-left:4px solid #703829;padding:12px 16px;margin:16px 0;'>
        <strong>Comentarios del cliente:</strong><br>" . nl2br(htmlspecialchars($mensaje ?: 'Sin comentarios adicionales.')) . "
      </div>
      <p><a href='mailto:$email?subject=" . rawurlencode("Disponibilidad Casa Rojo del Tiétar ($llegada al $salida)") . "' style='background:#703829;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;'>Confirmar disponibilidad por Email</a></p>
    </div>
  </div>
</body></html>";

$headersOwner  = "MIME-Version: 1.0\r\n";
$headersOwner .= "Content-type: text/html; charset=UTF-8\r\n";
$headersOwner .= "From: Reservas Casa Rojo del Tietar <$ownerEmail>\r\n";
if ($email !== '') {
    $headersOwner .= "Reply-To: $nombre <$email>\r\n";
}
@mail($ownerEmail, $ownerSubject, $ownerHtml, $headersOwner);

// 2. Email de confirmación y hospitalidad para el cliente
if ($email !== '') {
    $clientSubject = "Tu solicitud en Casa Rojo del Tiétar ($llegada al $salida) · Resumen y detalles prácticos";
    $clientHtml = "
    <html><body style='font-family:Arial,sans-serif;color:#2c2926;background:#f4f0ea;padding:24px;'>
      <div style='max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e2d9ce;'>
        <div style='background:#1c1b1a;color:#fff;padding:24px 32px;border-bottom:4px solid #703829;'>
          <div style='font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#ffb4a0;font-weight:bold;'>Casa Rojo del Tiétar · La Iglesuela del Tiétar (Toledo)</div>
          <h2 style='margin:6px 0 0 0;font-family:Georgia,serif;font-weight:normal;'>Hola, $firstName. Hemos recibido tu consulta.</h2>
        </div>
        <div style='padding:28px 32px;font-size:15px;line-height:1.7;'>
          <p>Acabamos de recibir tu solicitud para venir a <strong>Casa Rojo del Tiétar</strong> del <strong>$llegada</strong> al <strong>$salida</strong> ($noches noches) para un grupo de <strong>$huespedes personas</strong>. Revisamos el calendario y te confirmamos personalmente en muy poco tiempo.</p>
          <div style='background:#fff8f5;border:1px solid #eadcd5;border-radius:10px;padding:18px 20px;margin:20px 0;font-size:14px;'>
            <strong style='color:#703829;font-family:Georgia,serif;font-size:16px;'>Lo que ya tenéis preparado en la casa:</strong>
            <ul style='padding-left:18px;margin:10px 0 0 0;'>
              <li><strong>5 habitaciones tipo suite con baño privado propio:</strong> cada pareja o familia tiene su propio cuarto de baño completo (dos suites con bañera exenta y una en planta baja adaptada a movilidad reducida).</li>
              <li><strong>El desayuno de todos los días corre de nuestra cuenta:</strong> café en grano recién molido en cafetera automática, leche, Cola Cao, huevos, pan, aceite de oliva virgen, tomate, mantequilla, mermelada, fruta y bizcocho casero.</li>
              <li><strong>Casa templada y leña gratis:</strong> encendemos el suelo radiante antes de vuestra llegada y tenéis leña de encina gratuita para la chimenea del salón y la barbacoa del patio.</li>
              <li><strong>Comida casera por encargo si no queréis cocinar:</strong> si el sábado os apetece un cochifrito tradicional, asado o paella de asador local a precio de pueblo, os lo dejamos encargado.</li>
            </ul>
          </div>
          <p><strong>Presupuesto orientativo (Ref. #$refId):</strong><br>
          Total estancia ($noches noches · $huespedes personas con desayuno incluido): <strong style='color:#703829;font-size:17px;'>$totalEstimado €</strong> ($precioPersonaNoche € / persona y noche).<br>
          <span style='font-size:13px;color:#6b635b;'>Señal de reserva (25%): $senal25 € (100% reembolsable hasta 7 días antes de la llegada) · Fianza reembolsable: $fianza €.</span></p>
          <p style='margin-top:24px;'>Cualquier duda rápida puedes responder directamente a este correo o escribirnos al <strong>605 935 487</strong>.<br><br>
          Un saludo desde La Iglesuela del Tiétar,<br>
          <strong style='color:#703829;'>Casa Rojo del Tiétar</strong><br>
          <span style='font-size:13px;color:#6b635b;'>Paraje el Carrascal, s/n · 45633 La Iglesuela del Tiétar (Toledo) · casarural@rojodeltietar.com</span></p>
        </div>
      </div>
    </body></html>";

    $headersClient  = "MIME-Version: 1.0\r\n";
    $headersClient .= "Content-type: text/html; charset=UTF-8\r\n";
    $headersClient .= "From: Casa Rojo del Tietar <$ownerEmail>\r\n";
    $headersClient .= "Reply-To: Casa Rojo del Tietar <$ownerEmail>\r\n";
    @mail($email, $clientSubject, $clientHtml, $headersClient);
}

// Guardar registro en api/data/reservas.json
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
    @file_put_contents($dataDir . '/.htaccess', "Deny from all\n");
}
$logFile = $dataDir . '/reservas.json';
$existing = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) : [];
if (!is_array($existing)) $existing = [];
array_unshift($existing, [
    'id' => $refId,
    'createdAt' => date('c'),
    'nombre' => $nombre,
    'email' => $email,
    'telefono' => $telefono,
    'llegada' => $llegada,
    'salida' => $salida,
    'huespedes' => $huespedes,
    'noches' => $noches,
    'totalEstimado' => $totalEstimado,
    'senal25' => $senal25,
    'mensaje' => $mensaje,
    'destinationOwner' => $ownerEmail,
]);
@file_put_contents($logFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode([
    'ok' => true,
    'destinationOwner' => $ownerEmail,
    'lead' => [
        'id' => $refId,
        'nombre' => $nombre,
        'email' => $email,
        'telefono' => $telefono,
        'llegada' => $llegada,
        'salida' => $salida,
        'huespedes' => $huespedes,
        'noches' => $noches,
        'totalEstimado' => $totalEstimado,
        'senal25' => $senal25,
        'fianza' => $fianza,
        'precioPorPersonaNoche' => $precioPersonaNoche,
    ]
]);
