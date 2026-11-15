<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

method_required('POST');
$data = read_json_body();

if (empty($data['username']) || empty($data['password'])) {
    json_response(['success' => false, 'error' => 'Nom d\'utilisateur et mot de passe requis.'], 400);
}

$username = trim($data['username']);
$password = $data['password'];

try {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT user_id, username, password_hash FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password_hash'])) {
        json_response(['success' => false, 'error' => 'Identifiants incorrects.'], 401);
    }
    
    $_SESSION['user_id'] = (int) $user['user_id'];
    $_SESSION['username'] = $user['username'];
    
    json_response(['success' => true, 'user' => ['user_id' => $user['user_id'], 'username' => $user['username']]]);
} catch (Throwable $e) {
    json_response(['success' => false, 'error' => 'Erreur lors de la connexion.'], 500);
}
