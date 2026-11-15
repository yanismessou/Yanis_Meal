<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

method_required('POST');

if (!isset($_SESSION['user_id'])) {
    json_response(['success' => false, 'error' => 'Non authentifié'], 401);
}

$allowedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
$allowedMeals = ['breakfast', 'lunch', 'dinner'];

try {
    $data = read_json_body();
    $dayName = $data['day_name'] ?? '';
    $mealType = $data['meal_type'] ?? '';
    $dishId = $data['dish_id'] ?? null;

    if (!in_array($dayName, $allowedDays, true) || !in_array($mealType, $allowedMeals, true)) {
        json_response(['success' => false, 'error' => 'Jour ou type de repas invalide.'], 422);
    }

    if ($dishId !== null && (!is_numeric($dishId) || (int) $dishId <= 0)) {
        json_response(['success' => false, 'error' => 'Plat invalide.'], 422);
    }

    $pdo = get_pdo();

    if ($dishId !== null) {
        $dishCheck = $pdo->prepare('SELECT dish_id FROM dishes WHERE dish_id = ?');
        $dishCheck->execute([(int) $dishId]);
        if (!$dishCheck->fetch()) {
            json_response(['success' => false, 'error' => 'Ce plat n existe pas.'], 404);
        }
    }

    $stmt = $pdo->prepare(
        'INSERT INTO meal_plan (user_id, day_name, meal_type, dish_id)
         VALUES (:user_id, :day_name, :meal_type, :dish_id)
         ON DUPLICATE KEY UPDATE dish_id = VALUES(dish_id)'
    );

    $stmt->execute([
        ':user_id' => $_SESSION['user_id'],
        ':day_name' => $dayName,
        ':meal_type' => $mealType,
        ':dish_id' => $dishId !== null ? (int) $dishId : null,
    ]);

    json_response(['success' => true, 'message' => 'Repas sauvegarde.']);
} catch (Throwable $exception) {
    json_response(['success' => false, 'error' => 'Impossible de sauvegarder le repas.'], 500);
}
