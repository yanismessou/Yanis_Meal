<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

method_required('POST');

session_destroy();
json_response(['success' => true]);
