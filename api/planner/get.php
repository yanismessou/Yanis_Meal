<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

method_required('GET');

if (!isset($_SESSION['user_id'])) {
    json_response(['success' => false, 'error' => 'Non authentifié'], 401);
}

try {
    $pdo = get_pdo();
    $stmt = $pdo->prepare(
        'SELECT
            mp.plan_id,
            mp.day_name,
            mp.meal_type,
            d.dish_id,
            d.name AS dish_name,
            d.category,
            i.ingredient_id,
            i.name AS ingredient_name,
            di.quantity,
            di.unit
        FROM meal_plan mp
        LEFT JOIN dishes d ON d.dish_id = mp.dish_id
        LEFT JOIN dish_ingredients di ON di.dish_id = d.dish_id
        LEFT JOIN ingredients i ON i.ingredient_id = di.ingredient_id
        WHERE mp.user_id = ?
        ORDER BY mp.day_name, mp.meal_type, i.name'
    );
    $stmt->execute([$_SESSION['user_id']]);

    $plan = [];
    $shopping = [];

    foreach ($stmt->fetchAll() as $row) {
        $key = $row['day_name'] . '-' . $row['meal_type'];

        if (!isset($plan[$key])) {
            $plan[$key] = [
                'plan_id' => (int) $row['plan_id'],
                'day_name' => $row['day_name'],
                'meal_type' => $row['meal_type'],
                'dish' => $row['dish_id'] !== null ? [
                    'dish_id' => (int) $row['dish_id'],
                    'name' => $row['dish_name'],
                    'category' => $row['category'],
                    'ingredients' => [],
                ] : null,
            ];
        }

        if ($row['ingredient_id'] !== null && $plan[$key]['dish'] !== null) {
            $ingredient = [
                'ingredient_id' => (int) $row['ingredient_id'],
                'name' => $row['ingredient_name'],
                'quantity' => $row['quantity'] !== null ? (float) $row['quantity'] : null,
                'unit' => $row['unit'],
            ];

            $plan[$key]['dish']['ingredients'][] = $ingredient;

            $shoppingKey = strtolower($ingredient['name']) . '|' . ($ingredient['unit'] ?? '');
            if (!isset($shopping[$shoppingKey])) {
                $shopping[$shoppingKey] = [
                    'name' => $ingredient['name'],
                    'quantity' => 0,
                    'unit' => $ingredient['unit'],
                ];
            }

            if ($ingredient['quantity'] !== null) {
                $shopping[$shoppingKey]['quantity'] += $ingredient['quantity'];
            }
        }
    }

    json_response([
        'success' => true,
        'plan' => array_values($plan),
        'shopping_list' => array_values($shopping),
    ]);
} catch (Throwable $exception) {
    json_response(['success' => false, 'error' => 'Impossible de charger la planification.'], 500);
}
