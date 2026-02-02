-- =========================================
-- CLICOM - Schéma Base de Données
-- =========================================
-- Description: CRM & Gestion de Projets pour Agence Marketing Suisse
-- Stack: MySQL 8.x
-- TVA Suisse: 8.1% (2024+) - Anciennement 7.7%
-- =========================================

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS clicom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clicom_db;

-- =========================================
-- TABLE: users
-- =========================================
-- Description: Gestion des utilisateurs internes (équipe CLICOM)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'collaborator') DEFAULT 'collaborator',
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: clients
-- =========================================
-- Description: Base de contacts/prospects/clients
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    status ENUM('lead', 'prospect', 'active', 'inactive', 'churned') DEFAULT 'lead',
    source VARCHAR(100) COMMENT 'Origine du lead: website, referral, ads, etc.',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_company (company_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: quotes
-- =========================================
-- Description: Devis avec gestion TVA suisse (8.1%)
CREATE TABLE IF NOT EXISTS quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    quote_number VARCHAR(50) UNIQUE COMMENT 'Format: DEVIS-YYYY-XXXX',
    total_amount_ht DECIMAL(10,2) NOT NULL COMMENT 'Montant Hors Taxes',
    vat_rate DECIMAL(4,2) DEFAULT 8.1 COMMENT 'Taux TVA Suisse (8.1% actuel)',
    total_amount_ttc DECIMAL(10,2) GENERATED ALWAYS AS (total_amount_ht * (1 + vat_rate/100)) STORED,
    status ENUM('draft', 'sent', 'accepted', 'rejected', 'paid', 'overdue') DEFAULT 'draft',
    valid_until DATE COMMENT 'Date de validité du devis',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client (client_id),
    INDEX idx_status (status),
    INDEX idx_quote_number (quote_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: invoices
-- =========================================
-- Description: Factures liées aux devis
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE COMMENT 'Format: FACT-YYYY-XXXX',
    due_date DATE NOT NULL,
    status ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,
    payment_method VARCHAR(50) COMMENT 'virement, carte, twint, etc.',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    INDEX idx_quote (quote_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_invoice_number (invoice_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: projects
-- =========================================
-- Description: Projets clients avec méthode 30-60-90
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    phase ENUM('onboarding', 'growth', 'optimization', 'completed', 'paused') DEFAULT 'onboarding',
    token_access VARCHAR(64) UNIQUE COMMENT 'Token sécurisé pour portail client',
    start_date DATE,
    end_date DATE,
    budget_monthly DECIMAL(10,2) COMMENT 'Budget mensuel récurrent (500-5000 CHF)',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client (client_id),
    INDEX idx_phase (phase),
    INDEX idx_token (token_access)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- TABLE: tasks
-- =========================================
-- Description: Tâches & Actions (CRM)
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    related_to_id INT NOT NULL COMMENT 'ID du client ou projet associé',
    related_to_type ENUM('client', 'project') DEFAULT 'client',
    type VARCHAR(100) NOT NULL COMMENT 'Ex: "Rappeler prospect", "Envoyer devis", "Livraison"',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    due_date DATE,
    assigned_to INT COMMENT 'ID de l\'utilisateur assigné',
    status ENUM('todo', 'in_progress', 'done', 'cancelled') DEFAULT 'todo',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_related (related_to_id, related_to_type),
    INDEX idx_priority (priority),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================
-- DONNÉES DE TEST
-- =========================================

-- Utilisateur admin par défaut (password: clicom2024)
INSERT INTO users (email, password_hash, role, full_name) VALUES
('admin@clicom.ch', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Admin CLICOM');

-- Client exemple
INSERT INTO clients (company_name, contact_name, email, phone, status, source) VALUES
('Swiss Innovations SA', 'Jean Dupont', 'jean.dupont@swiss-innovations.ch', '+41 22 123 45 67', 'prospect', 'website');

-- =========================================
-- VUES UTILES
-- =========================================

-- Vue: Tableau de bord des leads urgents
CREATE OR REPLACE VIEW v_urgent_leads AS
SELECT
    c.id,
    c.company_name,
    c.contact_name,
    c.email,
    t.type AS task_type,
    t.due_date,
    t.priority
FROM clients c
INNER JOIN tasks t ON c.id = t.related_to_id AND t.related_to_type = 'client'
WHERE t.priority IN ('high', 'urgent') AND t.status = 'todo'
ORDER BY t.priority DESC, t.due_date ASC;

-- Vue: Facturation en attente
CREATE OR REPLACE VIEW v_pending_invoices AS
SELECT
    i.invoice_number,
    c.company_name,
    q.total_amount_ttc,
    i.due_date,
    i.status,
    DATEDIFF(CURRENT_DATE, i.due_date) AS days_overdue
FROM invoices i
INNER JOIN quotes q ON i.quote_id = q.id
INNER JOIN clients c ON q.client_id = c.id
WHERE i.status IN ('pending', 'overdue')
ORDER BY i.due_date ASC;

-- =========================================
-- FIN DU SCHÉMA
-- =========================================
