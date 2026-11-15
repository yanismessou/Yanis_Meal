<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
session_start();

function get_pdo(): PDO
{
    $host = 'db';
    $db = 'mealplanner';
    $user = 'webuser';
    $pass = 'webpass';
    $dsn = "mysql:host={$host};dbname={$db};charset=utf8mb4";

    return new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_body(): array
{
    $rawBody = file_get_contents('php://input');
    $data = json_decode($rawBody ?: '', true);

    if (!is_array($data)) {
        json_response(['success' => false, 'error' => 'JSON invalide.'], 400);
    }

    return $data;
}

function method_required(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        json_response(['success' => false, 'error' => 'Methode non autorisee.'], 405);
    }
}
