<?php
/**
 * Endpoint de persistencia protegido por hash SHA-256 salted para /keystatic en cPanel / Apache
 */
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

$expectedHash = '05c0dd5a33807e1ab100a7261cbc62995272356d36d7f362cd83eaf7ce806b4e';
$token = (string)($data['authToken'] ?? '');
if (!hash_equals($expectedHash, $token)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}

unset($data['authToken']);
$dir = __DIR__ . '/data/keystatic';
if (!is_dir($dir)) {
    @mkdir($dir, 0755, true);
    @file_put_contents($dir . '/.htaccess', "Deny from all\n");
}
$collection = preg_replace('/[^a-z0-9_-]/i', '', $data['collection'] ?? 'general');
@file_put_contents(
    $dir . '/' . $collection . '-' . date('Ymd-His') . '.json',
    json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);
echo json_encode(['ok' => true]);
