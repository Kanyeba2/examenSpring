-- ============================================================================
-- Script de création de la base de données pour l'application Examen Spring
-- Domaine : Plateforme d'adoption d'animaux
-- ============================================================================

-- Supprimer la base de données si elle existe
DROP DATABASE IF EXISTS examen_spring;

-- Créer la base de données
CREATE DATABASE examen_spring CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE examen_spring;

-- ============================================================================
-- TABLE 1: TYPE_ANIMAL
-- ============================================================================
CREATE TABLE type_animal (
    id_type_animal INT AUTO_INCREMENT PRIMARY KEY,
    nom_type_animal VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 2: ANIMAL
-- Jointure avec TYPE_ANIMAL via id_type_animal
-- ============================================================================
CREATE TABLE animal (
    id_animal INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    age INT NOT NULL CHECK (age >= 0),
    sexe VARCHAR(10) NOT NULL,
    description TEXT,
    statut VARCHAR(50) NOT NULL DEFAULT 'disponible',
    photo_url VARCHAR(255),
    id_type_animal INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_animal_type_animal FOREIGN KEY (id_type_animal) REFERENCES type_animal(id_type_animal) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_animal_type_animal ON animal(id_type_animal);

-- ============================================================================
-- TABLE 3: ADOPTANT
-- ============================================================================
CREATE TABLE adoptant (
    id_adoptant INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telephone VARCHAR(30),
    adresse VARCHAR(255),
    profession VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'adoptant',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 4: DEMANDE_ADOPTION
-- Jointure entre ANIMAL et ADOPTANT
-- ============================================================================
CREATE TABLE demande_adoption (
    id_demande INT AUTO_INCREMENT PRIMARY KEY,
    id_animal INT NOT NULL,
    id_adoptant INT NOT NULL,
    date_demande DATETIME NOT NULL,
    statut VARCHAR(50) NOT NULL DEFAULT 'nouvelle',
    message TEXT,
    date_decision DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_demande_animal FOREIGN KEY (id_animal) REFERENCES animal(id_animal) ON DELETE RESTRICT,
    CONSTRAINT fk_demande_adoptant FOREIGN KEY (id_adoptant) REFERENCES adoptant(id_adoptant) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_demande_animal ON demande_adoption(id_animal);
CREATE INDEX idx_demande_adoptant ON demande_adoption(id_adoptant);

-- ============================================================================
-- TABLE 5: SUIVI_ADOPTION
-- Jointure entre DEMANDE_ADOPTION et son suivi post-adoption
-- ============================================================================
CREATE TABLE suivi_adoption (
    id_suivi INT AUTO_INCREMENT PRIMARY KEY,
    id_demande INT NOT NULL,
    date_suivi DATETIME NOT NULL,
    etat_sante VARCHAR(150),
    commentaire TEXT,
    action_suivante VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_suivi_demande FOREIGN KEY (id_demande) REFERENCES demande_adoption(id_demande) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DONNÉES DE TEST
-- ============================================================================

-- Insertion des types d'animaux
INSERT INTO type_animal (nom_type_animal, description) VALUES
('Chien', 'Chiens de différentes races disponibles à l''adoption'),
('Chat', 'Chats domestiques et chats de refuge'),
('Rongeur', 'Rongeurs comme les hamsters, cobayes et lapins'),
('Oiseau', 'Oiseaux de compagnie et oiseaux de refuge'),
('Reptile', 'Reptiles et petits animaux exotiques');

-- Insertion des animaux
INSERT INTO animal (nom, age, sexe, description, statut, photo_url, id_type_animal) VALUES
('Rex', 3, 'mâle', 'Chien actif et affectueux, aime les longues promenades.', 'disponible', 'https://example.com/images/rex.jpg', 1),
('Mina', 2, 'femelle', 'Chat calme et joueur, sociable avec les enfants.', 'disponible', 'https://example.com/images/mina.jpg', 2),
('Nuts', 1, 'mâle', 'Hamster curieux et vif, bon premier animal de compagnie.', 'disponible', 'https://example.com/images/nuts.jpg', 3),
('Luna', 4, 'femelle', 'Canari chanteur, très doux et facile à entretenir.', 'disponible', 'https://example.com/images/luna.jpg', 4),
('Zelda', 2, 'femelle', 'Tortue terrestre calme nécessitant un environnement chauffé.', 'disponible', 'https://example.com/images/zelda.jpg', 5);

-- Insertion des adoptants
INSERT INTO adoptant (nom, prenom, email, telephone, adresse, profession, role) VALUES
('Dupont', 'Alice', 'alice.dupont@example.com', '0601020304', '12 rue des Fleurs, Paris', 'Professeur', 'adoptant'),
('Martin', 'Lucas', 'lucas.martin@example.com', '0605060708', '8 avenue Victor Hugo, Lyon', 'Ingénieur', 'adoptant'),
('Nguyen', 'Mai', 'mai.nguyen@example.com', '0612345678', '5 boulevard Saint-Michel, Paris', 'Étudiante', 'adoptant');

-- Insertion des demandes d'adoption
INSERT INTO demande_adoption (id_animal, id_adoptant, date_demande, statut, message, date_decision) VALUES
(1, 1, '2026-06-20 10:15:00', 'acceptée', 'Rex serait parfait pour ma famille.', '2026-06-22 14:30:00'),
(2, 2, '2026-06-25 11:00:00', 'en_cours', 'Je souhaite adopter Mina pour mon appartement.', NULL),
(4, 3, '2026-06-27 09:45:00', 'nouvelle', 'Luna m''intéresse pour son chant et sa douceur.', NULL);

-- Insertion des suivis post-adoption
INSERT INTO suivi_adoption (id_demande, date_suivi, etat_sante, commentaire, action_suivante) VALUES
(1, '2026-07-01 16:00:00', 'Bonne santé', 'Rex s''adapte bien à son nouveau foyer.', 'Visite de contrôle dans 1 mois'),
(1, '2026-07-10 10:00:00', 'Très actif', 'Propriétaire envoie régulièrement des nouvelles.', 'Aucun suivi nécessaire pour le moment');

-- ============================================================================
-- Vérification des données
-- ============================================================================

-- Afficher les types d'animaux
SELECT 'TYPES D''ANIMAUX' AS 'TABLE';
SELECT * FROM type_animal;

-- Afficher les animaux avec les types
SELECT 'ANIMAUX AVEC TYPES' AS 'JOINTURE';
SELECT a.id_animal, a.nom, a.age, a.sexe, a.statut, t.nom_type_animal
FROM animal a
LEFT JOIN type_animal t ON a.id_type_animal = t.id_type_animal;

-- Afficher les adoptants
SELECT 'ADOPTANTS' AS 'TABLE';
SELECT * FROM adoptant;

-- Afficher les demandes d'adoption avec jointures
SELECT 'DEMANDES D''ADOPTION' AS 'JOINTURE';
SELECT d.id_demande, a.nom AS animal, ad.nom AS adoptant, d.date_demande, d.statut
FROM demande_adoption d
JOIN animal a ON d.id_animal = a.id_animal
JOIN adoptant ad ON d.id_adoptant = ad.id_adoptant;

-- Afficher les suivis post-adoption
SELECT 'SUIVI POST-ADOPTION' AS 'TABLE';
SELECT s.id_suivi, d.id_demande, a.nom AS animal, ad.nom AS adoptant, s.date_suivi, s.etat_sante, s.commentaire
FROM suivi_adoption s
JOIN demande_adoption d ON s.id_demande = d.id_demande
JOIN animal a ON d.id_animal = a.id_animal
JOIN adoptant ad ON d.id_adoptant = ad.id_adoptant;
