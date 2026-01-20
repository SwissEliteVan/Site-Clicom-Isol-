<?php
/**
 * CLICOM - API Contact
 * ====================
 * Endpoint pour le formulaire de contact du site vitrine
 *
 * Actions:
 * 1. Validation des données (honeypot, email)
 * 2. Insertion dans la table 'clients'
 * 3. Création d'une tâche 'Rappeler prospect' (priorité haute)
 * 4. Envoi email de notification
 */

require_once 'config.php';

// =========================================
// HEADERS CORS (Vercel -> Hostinger)
// =========================================
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Gérer la requête OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Accepter uniquement POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// =========================================
// RÉCUPÉRATION DES DONNÉES
// =========================================
$input = json_decode(file_get_contents('php://input'), true);

$companyName = isset($input['company_name']) ? sanitizeInput($input['company_name']) : '';
$contactName = isset($input['contact_name']) ? sanitizeInput($input['contact_name']) : '';
$email = isset($input['email']) ? sanitizeInput($input['email']) : '';
$phone = isset($input['phone']) ? sanitizeInput($input['phone']) : '';
$project = isset($input['project']) ? sanitizeInput($input['project']) : '';
$honeypot = isset($input['website']) ? $input['website'] : ''; // Champ piège anti-spam

// =========================================
// VALIDATION
// =========================================

// 1. Vérification Honeypot
if (ENABLE_HONEYPOT && !empty($honeypot)) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Merci pour votre message']);
    exit;
}

// 2. Validation des champs obligatoires
if (empty($contactName) || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nom et email sont obligatoires']);
    exit;
}

// 3. Validation de l'email
if (!isValidEmail($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Format d\'email invalide']);
    exit;
}

// =========================================
// INSERTION DANS LA BASE
// =========================================
try {
    $db = getDBConnection();

    // 1. Vérifier si le client existe déjà (par email)
    $stmt = $db->prepare("SELECT id FROM clients WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $existingClient = $stmt->fetch();

    if ($existingClient) {
        $clientId = $existingClient['id'];
    } else {
        // Insérer nouveau client
        $stmt = $db->prepare("
            INSERT INTO clients (company_name, contact_name, email, phone, status)
            VALUES (:company_name, :contact_name, :email, :phone, 'lead')
        ");
        $stmt->execute([
            'company_name' => $companyName ?: null,
            'contact_name' => $contactName,
            'email' => $email,
            'phone' => $phone ?: null
        ]);
        $clientId = $db->lastInsertId();
    }

    // 2. Créer une tâche "Rappeler prospect" (Priorité Haute)
    $stmt = $db->prepare("
        INSERT INTO tasks (related_to_id, type, priority, due_date)
        VALUES (:client_id, 'Rappeler prospect', 'high', DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY))
    ");
    $stmt->execute([
        'client_id' => $clientId
    ]);

    // =========================================
    // ENVOI EMAIL NOTIFICATION
    // =========================================
    if (SEND_EMAILS) {
        $subject = "🔔 Nouveau Lead - " . $contactName;
        $emailBody = "
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2>Nouveau Lead CLICOM</h2>
                <p><strong>Nom:</strong> {$contactName}</p>
                <p><strong>Entreprise:</strong> {$companyName}</p>
                <p><strong>Email:</strong> {$email}</p>
                <p><strong>Téléphone:</strong> {$phone}</p>
                <p><strong>Projet:</strong><br>{$project}</p>
                <hr>
                <p style='color: #666;'>Source: Formulaire site vitrine</p>
            </body>
            </html>
        ";

        $headers = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        mail(ADMIN_EMAIL, $subject, $emailBody, $headers);
    }

    // =========================================
    // RÉPONSE SUCCESS
    // =========================================
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Merci ! Nous vous recontactons sous 24h.',
        'client_id' => $clientId
    ]);

} catch (PDOException $e) {
    error_log("Contact API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur est survenue. Veuillez réessayer.'
    ]);
}
