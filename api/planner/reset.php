<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

method_required('POST');

if (!isset($_SESSION['user_id'])) {
    json_response(['success' => false, 'error' => 'Non authentifié'], 401);
}

try {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('DELETE FROM meal_plan WHERE user_id = ?');
    $stmt->execute([$_SESSION['user_id']]);

    json_response(['success' => true, 'message' => 'Semaine reinitialisee.']);
} catch (Throwable $exception) {
    json_response(['success' => false, 'error' => 'Impossible de reinitialiser la semaine.'], 500);
}
