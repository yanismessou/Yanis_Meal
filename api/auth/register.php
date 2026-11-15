<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

method_required('POST');
$data = read_json_body();

if (empty($data['username']) || empty($data['password']) || empty($data['confirm_password'])) {
    json_response(['success' => false, 'error' => 'Tous les champs sont requis.'], 400);
}

if ($data['password'] !== $data['confirm_password']) {
    json_response(['success' => false, 'error' => 'Les mots de passe ne correspondent pas.'], 400);
}

if (strlen($data['password']) < 8) {
    json_response(['success' => false, 'error' => 'Le mot de passe doit contenir au moins 8 caractères.'], 400);
}

$username = trim($data['username']);
$password = $data['password'];

try {
    $pdo = get_pdo();
    
    // Check if user exists
    $stmt = $pdo->prepare('SELECT user_id FROM users WHERE username = ?');
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        json_response(['success' => false, 'error' => 'Ce nom d\'utilisateur est déjà pris.'], 400);
    }
    
    // Create user
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    $stmt->execute([$username, $hash]);
    
    $userId = (int) $pdo->lastInsertId();
    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $username;
    
    json_response(['success' => true, 'user' => ['user_id' => $userId, 'username' => $username]]);
} catch (Throwable $e) {
    json_response(['success' => false, 'error' => 'Erreur lors de la création du compte.'], 500);
}
