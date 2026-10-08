<?php
/**
 * Endpoint de persistencia para el panel /keystatic en servidores cPanel / Apache
 */
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false]);
    exit;
}
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    echo json_encode(['ok' => false]);
    exit;
}
$dir = __DIR__ . '/data/keystatic';
if (!is_dir($dir)) {
    @mkdir($dir, 0755, true);
    @file_put_contents($dir . '/.htaccess', "Deny from all\n");
}
$collection = preg_replace('/[^a-z0-9_-]/i', '', $data['collection'] ?? 'general');
@file_put_contents($dir . '/' . $collection . '-' . date('Ymd-His') . '.json', json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo json_encode(['ok' => true]);
