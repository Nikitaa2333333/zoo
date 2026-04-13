<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// ЮКасса credentials — замените на реальные перед продакшном
define('SHOP_ID', 'YOUR_SHOP_ID');
define('SECRET_KEY', 'YOUR_SECRET_KEY');

$input = json_decode(file_get_contents('php://input'), true);

$returnUrl = isset($input['return_url']) ? $input['return_url'] : 'https://bestfriend.ru/';
$description = isset($input['description']) ? $input['description'] : 'Предоплата за бронирование';
$amount = isset($input['amount']) ? $input['amount'] : '1000.00';

// Уникальный ключ идемпотентности
$idempotenceKey = uniqid('booking_', true);

$paymentData = [
    'amount' => [
        'value' => $amount,
        'currency' => 'RUB'
    ],
    'confirmation' => [
        'type' => 'redirect',
        'return_url' => $returnUrl
    ],
    'capture' => true,
    'description' => $description
];

$ch = curl_init('https://api.yookassa.ru/v3/payments');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($paymentData));
curl_setopt($ch, CURLOPT_USERPWD, SHOP_ID . ':' . SECRET_KEY);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Idempotence-Key: ' . $idempotenceKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 || $httpCode === 201) {
    $result = json_decode($response, true);
    echo json_encode([
        'success' => true,
        'payment_url' => $result['confirmation']['confirmation_url'],
        'payment_id' => $result['id']
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка создания платежа',
        'details' => json_decode($response, true)
    ]);
}
