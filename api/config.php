<?php
/**
 * CLICOM - Configuration Backend
 * ================================
 * Configuration de la connexion base de données et paramètres globaux
 */

// Configuration Base de Données (à adapter selon Hostinger)
define('DB_HOST', 'localhost');
define('DB_NAME', 'clicom_db');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_CHARSET', 'utf8mb4');

// Configuration Email
define('SEND_EMAILS', true); // Mettre à false en développement
define('ADMIN_EMAIL', 'contact@clicom.ch');
define('FROM_EMAIL', 'noreply@clicom.ch');
define('FROM_NAME', 'CLICOM - Agence Marketing');

// Configuration Sécurité
define('ALLOWED_ORIGINS', '*'); // En production: 'https://clicom.vercel.app'
define('ENABLE_HONEYPOT', true);

// Connexion PDO
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
        exit;
    }
}

// Helper: Validation Email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Helper: Sanitization
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}
