# Application Spring Boot - Examen Spring

Application Web & API Spring Boot avec JdbcTemplate et SimpleFlatMapper.

## 📋 Fonctionnalités Implémentées

✅ **Application Web & API** - RESTful API complète avec Spring Boot  
✅ **Architecture 3 Layers** - @Controller, @Service, @Repository  
✅ **Base de données** - 3+ tables (Categorie, Produit, Commande, LigneCommande) avec jointures  
✅ **JdbcTemplate** - Requêtes SQL personnalisées avec JdbcTemplate  
✅ **CRUD Complet** - Create, Read, Update, Delete pour tous les modèles  

## 🏗️ Architecture du Projet

```
examenSpring/
├── pom.xml                          # Configuration Maven
├── src/
│   ├── main/
│   │   ├── java/com/examen/
│   │   │   ├── application/
│   │   │   │   └── ExamenSpringApplication.java    # Classe principale
│   │   │   ├── modele/
│   │   │   │   ├── Categorie.java                  # Modèle Catégorie
│   │   │   │   ├── Produit.java                    # Modèle Produit
│   │   │   │   ├── Commande.java                   # Modèle Commande
│   │   │   │   └── LigneCommande.java              # Modèle Ligne de Commande
│   │   │   ├── controleur/
│   │   │   │   ├── CategorieControleur.java        # REST API Catégories
│   │   │   │   ├── ProduitControleur.java          # REST API Produits
│   │   │   │   └── CommandeControleur.java         # REST API Commandes
│   │   │   ├── service/
│   │   │   │   ├── CategorieService.java           # Service métier Catégories
│   │   │   │   ├── ProduitService.java             # Service métier Produits
│   │   │   │   └── CommandeService.java            # Service métier Commandes
│   │   │   └── depot/
│   │   │       ├── CategorieDepot.java             # Repository Catégories
│   │   │       ├── ProduitDepot.java               # Repository Produits
│   │   │       └── CommandeDepot.java              # Repository Commandes
│   │   └── resources/
│   │       ├── application.properties               # Configuration application
│   │       └── schema.sql                           # Script SQL initialisation DB
│   └── test/
└── README.md
```

## 🔧 Prérequis

- **Java JDK 11** ou supérieur
- **Maven 3.6+**
- **MySQL 5.7+** (via XAMPP)

## 📦 Installation

### 1. Préparer la Base de Données

```bash
# Démarrer MySQL via XAMPP
# Ou via ligne de commande
mysql -u root -p
```

### 2. Compiler le Projet

```bash
cd c:\xampp\htdocs\examenSpring
mvn clean install
```

### 3. Démarrer l'Application

```bash
mvn spring-boot:run
```

L'application démarre sur `http://localhost:8080`

## 🌐 Endpoints API

### Catégories
```
GET    /api/categories              # Lister toutes les catégories
GET    /api/categories/{id}         # Récupérer une catégorie
POST   /api/categories              # Créer une catégorie
PUT    /api/categories/{id}         # Mettre à jour une catégorie
DELETE /api/categories/{id}         # Supprimer une catégorie
```

### Produits
```
GET    /api/produits                # Lister tous les produits
GET    /api/produits/{id}           # Récupérer un produit
GET    /api/produits/categorie/{idCategorie}  # Produits par catégorie
POST   /api/produits                # Créer un produit
PUT    /api/produits/{id}           # Mettre à jour un produit
DELETE /api/produits/{id}           # Supprimer un produit
```

### Commandes
```
GET    /api/commandes               # Lister toutes les commandes
GET    /api/commandes/{id}          # Récupérer une commande
GET    /api/commandes/{id}/lignes   # Récupérer les lignes d'une commande (JOINTURE)
POST   /api/commandes               # Créer une commande
PUT    /api/commandes/{id}          # Mettre à jour une commande
DELETE /api/commandes/{id}          # Supprimer une commande
POST   /api/commandes/{id}/lignes   # Ajouter un article à une commande
```

## 📝 Exemples de Requêtes

### Créer une Catégorie
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "nomCategorie": "Électronique",
    "description": "Produits électroniques"
  }'
```

### Créer un Produit
```bash
curl -X POST http://localhost:8080/api/produits \
  -H "Content-Type: application/json" \
  -d '{
    "nomProduit": "Laptop",
    "prix": 1299.99,
    "quantiteStock": 5,
    "idCategorie": 1
  }'
```

### Créer une Commande
```bash
curl -X POST http://localhost:8080/api/commandes \
  -H "Content-Type: application/json" \
  -d '{
    "numeroCommande": "CMD-2024-001",
    "dateCommande": "2024-01-15T10:30:00",
    "montantTotal": 1299.99,
    "statut": "EN_COURS",
    "nombreArticles": 1
  }'
```

### Ajouter un article à une commande
```bash
curl -X POST http://localhost:8080/api/commandes/1/lignes \
  -H "Content-Type: application/json" \
  -d '{
    "idProduit": 1,
    "quantite": 2,
    "prixUnitaire": 149.99,
    "sousTotal": 299.98
  }'
```

## 📊 Base de Données

### Schéma des Tables

#### Table: categorie
```
id_categorie (PK)       | nom_categorie | description | created_at | updated_at
```

#### Table: produit
```
id_produit (PK) | nom_produit | prix | quantite_stock | id_categorie (FK) | created_at | updated_at
```

#### Table: commande
```
id_commande (PK) | numero_commande | date_commande | montant_total | statut | nombre_articles | created_at | updated_at
```

#### Table: ligne_commande
```
id_ligne_commande (PK) | id_commande (FK) | id_produit (FK) | quantite | prix_unitaire | sous_total | created_at
```

### Jointures Implémentées

1. **Produit JOIN Categorie** - Via `produit.id_categorie = categorie.id_categorie`
2. **LigneCommande JOIN Produit** - Via `ligne_commande.id_produit = produit.id_produit`
3. **LigneCommande JOIN Commande** - Via `ligne_commande.id_commande = commande.id_commande`

## 🛠️ Technologies Utilisées

- **Spring Boot 3.1.5**
- **Spring JDBC** - JdbcTemplate pour les requêtes SQL
- **MySQL Connector** - Driver MySQL 8.0.33
- **SimpleFlatMapper** - Mapping SQL vers objets
- **Lombok** - Réduction du code boilerplate
- **Maven** - Gestion des dépendances

## 📝 Validation des Données

Le service valide :
- Noms non vides
- Prix positifs
- Quantités non négatives
- Paramètres obligatoires

## 🐛 Dépannage

### Erreur: "Access denied for user 'root'@'localhost'"
Vérifier la configuration MySQL dans `application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=
```

### Erreur: "Cannot connect to MySQL server"
- Vérifier que MySQL est démarré via XAMPP
- Vérifier que le port 3306 est disponible

### Erreur: "JdbcTemplate not found"
Vérifier les dépendances:
```bash
mvn dependency:check
```

## 📚 Ressources

- [Documentation Spring Boot](https://spring.io/projects/spring-boot)
- [Spring JDBC](https://spring.io/guides/gs/relational-data-access/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [SimpleFlatMapper](https://simpleflatmapper.org/)

## ✨ Auteur

Projet d'examen - Spring Framework Module 01  
Université Protestante au Congo  

---

**Dernière mise à jour:** 2024-01-20
