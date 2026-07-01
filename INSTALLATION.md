# 🚀 GUIDE D'INSTALLATION RAPIDE

## Étape 1️⃣: Prérequis
# Vérifier les installations
java -version
mvn -version

## Étape 2️⃣: Démarrer MySQL via XAMPP

1. Ouvrir le **XAMPP Control Panel**
2. Cliquer sur **Start** à côté de **MySQL**
3. Vérifier que le statut passe au **vert**

**OU en ligne de commande:**
```bash
# Se connecter à MySQL
mysql -u root
```

## Étape 3️⃣: Compiler le Projet

Ouvrir **Terminal** ou **Invite de Commande** et exécuter:

```bash
# Aller au dossier du projet
cd c:\xampp\htdocs\examenSpring

# Compiler et télécharger les dépendances
mvn clean install
```

⏳ **Cela peut prendre 5-10 minutes la première fois** (téléchargement des dépendances)

## Étape 4️⃣: Démarrer l'Application

```bash
# Démarrer l'application Spring Boot
mvn spring-boot:run
```

✅ **Vous verrez:**
```
Started ExamenSpringApplication in X.XXX seconds (JVM running for X.XXX)
```

## Étape 5️⃣: Tester l'API

Ouvrir votre navigateur et accéder à:

### Tester les Catégories
```
http://localhost:8080/api/categories
```

### Tester les Produits
```
http://localhost:8080/api/produits
```

### Tester les Commandes
```
http://localhost:8080/api/commandes
```

## 📊 Vérifier les Données en Base

Ouvrir **phpMyAdmin** dans XAMPP:

1. Aller sur: `http://localhost/phpmyadmin`
2. Sélectionner la base de données: **examen_spring**
3. Voir les tables et les données

**OU en ligne de commande:**
```bash
mysql -u root examen_spring
SELECT * FROM categorie;
SELECT * FROM produit;
SELECT * FROM commande;
```

## 📝 Exemples de Requêtes API

### Avec CURL (Terminal)

**Lister les catégories:**
```bash
curl http://localhost:8080/api/categories
```

**Ajouter une catégorie:**
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d "{\"nomCategorie\": \"Ma Catégorie\", \"description\": \"Description\"}"
```

### Avec Postman

1. Télécharger [Postman](https://www.postman.com/downloads/)
2. Créer une nouvelle requête
3. Configurer:
   - **Method:** GET
   - **URL:** http://localhost:8080/api/categories
4. Cliquer sur **Send**

## 🛑 Arrêter l'Application

Appuyer sur **Ctrl + C** dans le terminal

## ❌ Problèmes Courants

### "Cannot connect to MySQL server"
- ✅ Vérifier que MySQL est démarré dans XAMPP
- ✅ Vérifier les identifiants dans `application.properties`

### "Maven command not found"
- ✅ Ajouter Maven au PATH système
- ✅ Redémarrer le terminal après installation

### "Port 8080 already in use"
- ✅ Arrêter les autres applications utilisant le port
- ✅ Ou modifier le port dans `application.properties`: `server.port=8081`

### "JdbcTemplate initialization failed"
- ✅ Vérifier que la base de données existe
- ✅ Vérifier la connexion MySQL

## 📞 Support

Voir le fichier **README.md** pour plus de détails et de documentation complète.

---

**Bon développement! 🎉**
