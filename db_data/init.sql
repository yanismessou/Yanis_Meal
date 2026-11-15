CREATE TABLE IF NOT EXISTS dishes (
    dish_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category ENUM('breakfast', 'lunch', 'dinner', 'any') DEFAULT 'any'
);

CREATE TABLE IF NOT EXISTS ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS dish_ingredients (
    dish_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity DECIMAL(8,2) DEFAULT NULL,
    unit VARCHAR(30) DEFAULT NULL,
    PRIMARY KEY (dish_id, ingredient_id),
    CONSTRAINT fk_dish_ingredients_dish
        FOREIGN KEY (dish_id) REFERENCES dishes(dish_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_dish_ingredients_ingredient
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS meal_plan (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    day_name VARCHAR(20) NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
    dish_id INT NULL,
    CONSTRAINT fk_meal_plan_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_meal_plan_dish
        FOREIGN KEY (dish_id) REFERENCES dishes(dish_id)
        ON DELETE SET NULL,
    CONSTRAINT unique_day_meal UNIQUE (user_id, day_name, meal_type)
);

INSERT INTO dishes (dish_id, name, category) VALUES
(1, 'Omelette', 'breakfast'),
(2, 'Pain + beurre', 'breakfast'),
(3, 'Yaourt + fruits', 'breakfast'),
(4, 'Céréales + lait', 'breakfast'),
(5, 'Bouillie de maïs', 'breakfast'),
(6, 'Riz + poulet', 'lunch'),
(7, 'Pâtes bolognaise', 'lunch'),
(8, 'Attiéké + poisson', 'lunch'),
(9, 'Foutou + sauce graine', 'dinner'),
(10, 'Soupe légumes', 'dinner'),
(11, 'Salade composée', 'lunch'),
(12, 'Riz + sauce tomate', 'dinner'),
(13, 'Alloco + oeuf', 'dinner'),
(14, 'Sushi', 'dinner'),
(15, 'Ramen', 'dinner');

INSERT INTO ingredients (ingredient_id, name) VALUES
(1, 'Oeufs'),
(2, 'Beurre'),
(3, 'Sel'),
(4, 'Poivre'),
(5, 'Pain'),
(6, 'Confiture'),
(7, 'Yaourt'),
(8, 'Banane'),
(9, 'Fraises'),
(10, 'Céréales'),
(11, 'Lait'),
(12, 'Farine de maïs'),
(13, 'Sucre'),
(14, 'Riz'),
(15, 'Poulet'),
(16, 'Oignon'),
(17, 'Huile'),
(18, 'Ail'),
(19, 'Pâtes'),
(20, 'Viande hachée'),
(21, 'Tomates'),
(22, 'Attiéké'),
(23, 'Poisson'),
(24, 'Piment'),
(25, 'Tomate'),
(26, 'Igname'),
(27, 'Huile de palme'),
(28, 'Viande'),
(29, 'Carottes'),
(30, 'Haricots verts'),
(31, 'Pommes de terre'),
(32, 'Laitue'),
(33, 'Concombre'),
(34, 'Huile d''olive'),
(35, 'Vinaigre'),
(36, 'Banane plantain'),
(37, 'Feuille d''algue'),
(38, 'Nouilles'),
(39, 'Bouillon');

INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity, unit) VALUES
(1, 1, 1, 'portion'),
(1, 2, 1, 'portion'),
(1, 3, 1, 'portion'),
(1, 4, 1, 'portion'),
(2, 5, 1, 'portion'),
(2, 2, 1, 'portion'),
(2, 6, 1, 'portion'),
(3, 7, 1, 'portion'),
(3, 8, 1, 'portion'),
(3, 9, 1, 'portion'),
(4, 10, 1, 'portion'),
(4, 11, 1, 'portion'),
(5, 12, 1, 'portion'),
(5, 11, 1, 'portion'),
(5, 13, 1, 'portion'),
(6, 14, 1, 'portion'),
(6, 15, 1, 'portion'),
(6, 16, 1, 'portion'),
(6, 17, 1, 'portion'),
(6, 3, 1, 'portion'),
(6, 18, 1, 'portion'),
(7, 19, 1, 'portion'),
(7, 20, 1, 'portion'),
(7, 21, 1, 'portion'),
(7, 16, 1, 'portion'),
(7, 18, 1, 'portion'),
(8, 22, 1, 'portion'),
(8, 23, 1, 'portion'),
(8, 16, 1, 'portion'),
(8, 24, 1, 'portion'),
(8, 17, 1, 'portion'),
(8, 25, 1, 'portion'),
(9, 26, 1, 'portion'),
(9, 27, 1, 'portion'),
(9, 28, 1, 'portion'),
(9, 24, 1, 'portion'),
(9, 3, 1, 'portion'),
(10, 29, 1, 'portion'),
(10, 30, 1, 'portion'),
(10, 31, 1, 'portion'),
(10, 3, 1, 'portion'),
(10, 16, 1, 'portion'),
(11, 32, 1, 'portion'),
(11, 21, 1, 'portion'),
(11, 33, 1, 'portion'),
(11, 34, 1, 'portion'),
(11, 35, 1, 'portion'),
(12, 14, 1, 'portion'),
(12, 21, 1, 'portion'),
(12, 16, 1, 'portion'),
(12, 17, 1, 'portion'),
(12, 3, 1, 'portion'),
(12, 18, 1, 'portion'),
(13, 36, 1, 'portion'),
(13, 1, 1, 'portion'),
(13, 17, 1, 'portion'),
(13, 3, 1, 'portion'),
(13, 24, 1, 'portion'),
(14, 14, 1, 'portion'),
(14, 23, 1, 'portion'),
(14, 37, 1, 'portion'),
(15, 38, 1, 'portion'),
(15, 39, 1, 'portion'),
(15, 1, 1, 'portion');
