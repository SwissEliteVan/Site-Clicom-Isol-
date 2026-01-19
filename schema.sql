-- CLICOM CRM Database Schema
CREATE DATABASE IF NOT EXISTS clicom_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE clicom_db;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clients (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(191) DEFAULT NULL,
  contact_name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'lead',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS quotes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id INT UNSIGNED NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  vat_rate DECIMAL(4,3) NOT NULL DEFAULT 0.077,
  status ENUM('draft', 'sent', 'paid', 'overdue') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quotes_client
    FOREIGN KEY (client_id) REFERENCES clients(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invoices (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quote_id INT UNSIGNED NOT NULL,
  invoice_number VARCHAR(100) NOT NULL UNIQUE,
  due_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  CONSTRAINT fk_invoices_quote
    FOREIGN KEY (quote_id) REFERENCES quotes(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id INT UNSIGNED NOT NULL,
  phase ENUM('onboarding', 'growth', 'optimization') NOT NULL DEFAULT 'onboarding',
  token_access VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_client
    FOREIGN KEY (client_id) REFERENCES clients(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  related_to_id INT UNSIGNED NOT NULL,
  type VARCHAR(191) NOT NULL,
  priority ENUM('low', 'high', 'urgent') NOT NULL DEFAULT 'low',
  due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_client
    FOREIGN KEY (related_to_id) REFERENCES clients(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- NOTE: La TVA suisse est indiquée à 7.7% (0.077). Vérifier si le taux 8.1% s'applique.
