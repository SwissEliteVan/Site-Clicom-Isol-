<?php
$config = [
    'db' => [
        'host' => 'localhost',
        'name' => 'clicom_db',
        'user' => 'clicom_user',
        'pass' => 'change_me',
        'charset' => 'utf8mb4',
    ],
    'send_emails' => true,
    'notification_email' => 'contact@clicom.ch',
];

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$rawBody = file_get_contents('php://input');
$data = [];

if (!empty($rawBody)) {
    $decoded = json_decode($rawBody, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        $data = $decoded;
    }
}

if (empty($data)) {
    $data = $_POST;
}

$honeypot = trim($data['website'] ?? '');
if ($honeypot !== '') {
    http_response_code(204);
    exit;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$project = trim($data['project'] ?? '');

if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Veuillez fournir un nom et un email valide.']);
    exit;
}

try {
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $config['db']['host'],
        $config['db']['name'],
        $config['db']['charset']
    );
    $pdo = new PDO($dsn, $config['db']['user'], $config['db']['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $pdo->beginTransaction();

    $clientStmt = $pdo->prepare(
        'INSERT INTO clients (company_name, contact_name, email, phone, status) VALUES (:company, :contact, :email, :phone, :status)'
    );
    $clientStmt->execute([
        ':company' => $project !== '' ? $project : null,
        ':contact' => $name,
        ':email' => $email,
        ':phone' => null,
        ':status' => 'lead',
    ]);

    $clientId = (int) $pdo->lastInsertId();

    $taskStmt = $pdo->prepare(
        'INSERT INTO tasks (related_to_id, type, priority, due_date) VALUES (:client_id, :type, :priority, :due_date)'
    );
    $taskStmt->execute([
        ':client_id' => $clientId,
        ':type' => 'Rappeler prospect',
        ':priority' => 'high',
        ':due_date' => date('Y-m-d', strtotime('+1 day')),
    ]);

    $pdo->commit();
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur.']);
    exit;
}

if ($config['send_emails'] === true) {
    $subject = 'Nouveau prospect CLICOM';
    $message = "Nom: {$name}\nEmail: {$email}\nProjet: {$project}\n";
    $headers = "From: no-reply@clicom.ch\r\n";
    @mail($config['notification_email'], $subject, $message, $headers);
}

echo json_encode(['success' => true, 'message' => 'Merci, nous revenons vers vous rapidement.']);
