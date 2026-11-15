<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

method_required('GET');

$ingredients = [
    "Omelette" => ["Oeufs", "Beurre", "Sel", "Poivre"],
    "Pain + beurre" => ["Pain", "Beurre", "Confiture"],
    "Yaourt + fruits" => ["Yaourt", "Banane", "Fraises"],
    "Céréales + lait" => ["Céréales", "Lait"],
    "Bouillie de maïs" => ["Farine de maïs", "Lait", "Sucre"],
    "Riz + poulet" => ["Riz", "Poulet", "Oignon", "Huile", "Sel", "Ail"],
    "Pâtes bolognaise" => ["Pâtes", "Viande hachée", "Tomates", "Oignon", "Ail"],
    "Attiéké + poisson" => ["Attiéké", "Poisson", "Oignon", "Piment", "Huile", "Tomate"],
    "Foutou + sauce graine" => ["Igname", "Huile de palme", "Viande", "Piment", "Sel"],
    "Soupe légumes" => ["Carottes", "Haricots verts", "Pommes de terre", "Sel", "Oignon"],
    "Salade composée" => ["Laitue", "Tomates", "Concombre", "Huile d'olive", "Vinaigre"],
    "Riz + sauce tomate" => ["Riz", "Tomates", "Oignon", "Huile", "Sel", "Ail"],
    "Alloco + oeuf" => ["Banane plantain", "Oeufs", "Huile", "Sel", "Piment"]
];

json_response(['success' => true, 'ingredients' => $ingredients]);
