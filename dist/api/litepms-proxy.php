<?php
/**
 * Прокси для LitePMS API
 * 
 * Размещается на продакшн-сервере по адресу /api/litepms-proxy.php
 * Проксирует запросы на https://litepms.ru/api/ минуя CORS-ограничения браузера.
 * 
 * Использование: /api/litepms-proxy.php?method=getRooms&login=...&hash=...
 */

// Разрешаем запросы с нашего домена
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

// Метод API из параметра запроса
$method = $_GET['method'] ?? '';
if (empty($method)) {
    http_response_code(400);
    echo json_encode(['error' => 'method parameter is required']);
    exit;
}

// Строим URL запроса к LitePMS (передаем все параметры как есть)
$params = $_GET;
unset($params['method']); // убираем наш параметр
$queryString = http_build_query($params);

$url = "https://litepms.ru/api/{$method}?" . $queryString;

// Делаем запрос к LitePMS
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_HTTPHEADER     => ['Accept: application/json'],
    CURLOPT_SSL_VERIFYPEER => false,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(502);
    echo json_encode(['error' => 'Upstream error: ' . $error]);
    exit;
}

http_response_code($httpCode);
echo $response;
