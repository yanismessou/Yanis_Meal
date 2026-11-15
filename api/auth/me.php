<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

method_required('GET');

if (isset($_SESSION['user_id'])) {
    json_response([
        'success' => true, 
        'user' => [
            'user_id' => $_SESSION['user_id'], 
            'username' => $_SESSION['username']
        ]
    ]);
} else {
    json_response(['success' => false, 'error' => 'Non connecté'], 401);
}
