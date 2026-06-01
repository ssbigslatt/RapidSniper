-- XAMPP MySQL Database for RapidSniper
-- Import this file via phpMyAdmin > Import

CREATE DATABASE IF NOT EXISTS rapidsniper_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE rapidsniper_db;

-- Users table (matches Django auth_user structure)
CREATE TABLE IF NOT EXISTS auth_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    first_name VARCHAR(150) DEFAULT '',
    last_name VARCHAR(150) DEFAULT '',
    is_active TINYINT(1) DEFAULT 1,
    is_staff TINYINT(1) DEFAULT 0,
    is_superuser TINYINT(1) DEFAULT 0,
    date_joined DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trades table (matches Django Trade model)
CREATE TABLE IF NOT EXISTS api_trade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pair VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL,
    subcategory VARCHAR(50) NULL,
    result VARCHAR(10) NULL,
    notes TEXT NULL,
    pnl DECIMAL(12,2) DEFAULT 0.00,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_date (date),
    INDEX idx_pair (pair)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert demo user (password stored as plain text - Django will hash via hasher)
INSERT INTO auth_user (username, password, email, first_name, last_name)
VALUES ('ssbigslatt', 'pbkdf2_sha256$870000$Iseedeadpeople$placeholder', 'ssbigslatt@example.com', '', '')
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample trades for demo user (user_id = 1)
INSERT INTO api_trade (user_id, pair, category, subcategory, result, notes, pnl, date) VALUES
(1, 'BCHUSD', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'BTCETH', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 'BTCUSD', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, 'EURGBP', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(1, 'EURUSD', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 'EURCAD', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(1, 'EURAUD', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(1, 'AUDUSD', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(1, 'GBPUSD', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(1, 'GBPAUD', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(1, 'USDCAD', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 11 DAY)),
(1, 'GBPJPY', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(1, 'USDCHF', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 13 DAY)),
(1, 'USDJPY', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 14 DAY)),
(1, 'EURCHF', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(1, 'EURJPY', 'currency', NULL, NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 16 DAY)),
(1, 'Volatility 5 Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 17 DAY)),
(1, 'Volatility 5 (1s) Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(1, 'Volatility 10 (1s) Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 19 DAY)),
(1, 'Volatility 15 (1s) Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(1, 'Volatility 25 (1s) Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 21 DAY)),
(1, 'Volatility 25 Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 22 DAY)),
(1, 'Volatility 30 Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 23 DAY)),
(1, 'Volatility 30 (1s) Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 24 DAY)),
(1, 'Volatility 50 (1s) Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(1, 'Volatility 50 Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 26 DAY)),
(1, 'Volatility 75 Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 27 DAY)),
(1, 'Volatility 75 (1s) Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 28 DAY)),
(1, 'Volatility 90 (1s) Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 29 DAY)),
(1, 'Volatility 100 (1s) Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(1, 'Volatility 100 Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 31 DAY)),
(1, 'Volatility 250 (1s) Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 32 DAY)),
(1, 'Crash 50 Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 33 DAY)),
(1, 'Crash 150 Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 34 DAY)),
(1, 'Crash 300 Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 35 DAY)),
(1, 'Boom 500 Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 36 DAY)),
(1, 'Boom 600 Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 37 DAY)),
(1, 'Step Index', 'index', 'deriv', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 38 DAY)),
(1, 'FiboX', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 39 DAY)),
(1, 'FX Vol 20', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 40 DAY)),
(1, 'FX Vol 40', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 41 DAY)),
(1, 'FX Vol 60', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 42 DAY)),
(1, 'FX Vol 80', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 43 DAY)),
(1, 'FX Vol 99', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 44 DAY)),
(1, 'FlipX 1', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 45 DAY)),
(1, 'FlipX 2', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 46 DAY)),
(1, 'FlipX 3', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 47 DAY)),
(1, 'FlipX 4', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 48 DAY)),
(1, 'FlipX 5', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 49 DAY)),
(1, 'GainX 400', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 50 DAY)),
(1, 'GainX 600', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 51 DAY)),
(1, 'GainX 800', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 52 DAY)),
(1, 'GainX 999', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 53 DAY)),
(1, 'GainX 1200', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 54 DAY)),
(1, 'PainX 400', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 55 DAY)),
(1, 'PainX 600', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 56 DAY)),
(1, 'PainX 800', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 57 DAY)),
(1, 'PainX 999', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 58 DAY)),
(1, 'PainX 1200', 'index', 'weltrade', NULL, '', 0.00, DATE_SUB(NOW(), INTERVAL 59 DAY));