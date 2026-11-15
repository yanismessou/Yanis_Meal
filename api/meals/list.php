<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

method_required('GET');

try {
    $pdo = get_pdo();
    $stmt = $pdo->query(
        'SELECT
            d.dish_id,
            d.name,
            d.category,
            i.ingredient_id,
            i.name AS ingredient_name,
            di.quantity,
            di.unit
        FROM dishes d
        LEFT JOIN dish_ingredients di ON di.dish_id = d.dish_id
        LEFT JOIN ingredients i ON i.ingredient_id = di.ingredient_id
        ORDER BY d.name, i.name'
    );

    $dishes = [];
    foreach ($stmt->fetchAll() as $row) {
        $dishId = (int) $row['dish_id'];

        if (!isset($dishes[$dishId])) {
            $dishes[$dishId] = [
                'dish_id' => $dishId,
                'name' => $row['name'],
                'category' => $row['category'],
                'ingredients' => [],
            ];
        }

        if ($row['ingredient_id'] !== null) {
            $dishes[$dishId]['ingredients'][] = [
                'ingredient_id' => (int) $row['ingredient_id'],
                'name' => $row['ingredient_name'],
                'quantity' => $row['quantity'] !== null ? (float) $row['quantity'] : null,
                'unit' => $row['unit'],
            ];
        }
    }

    json_response(['success' => true, 'dishes' => array_values($dishes)]);
} catch (Throwable $exception) {
    json_response(['success' => false, 'error' => 'Impossible de charger les plats.'], 500);
}
