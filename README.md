# Examen Spring - Plateforme d’adoption d’animaux

Application Web et API Spring Boot pour gérer des animaux, des demandes d’adoption et des suivis post-adoption.

## ✅ Fonctionnalités principales

- Page publique d’accueil : `accueil.html`
- Interface d’administration : `administration.html`
- Gestion des animaux, types, adoptants, demandes et suivis
- Upload d’images d’animaux via `/api/animaux/upload`
- Redirection de `/` vers `accueil.html`
- Exposition des fichiers uploadés via `/uploads/**`
- Script SQL d’initialisation dans `src/main/resources/schema.sql`

## 📂 Structure du projet

```
examenSpring/
├── pom.xml
├── README.md
├── uploads/                      # Images uploadées (dossier à créer)
├── src/
│   ├── main/
│   │   ├── java/com/examen/
│   │   │   ├── application/
│   │   │   │   └── ExamenSpringApplication.java
│   │   │   ├── controleur/
│   │   │   │   ├── AnimalControleur.java
│   │   │   │   ├── AdoptantControleur.java
│   │   │   │   ├── DemandeAdoptionControleur.java
│   │   │   │   ├── SuiviAdoptionControleur.java
│   │   │   │   ├── TypeAnimalControleur.java
│   │   │   │   ├── RootController.java
│   │   │   │   └── UploadConfig.java
│   │   │   ├── modele/
│   │   │   │   ├── Animal.java
│   │   │   │   ├── Adoptant.java
│   │   │   │   ├── DemandeAdoption.java
│   │   │   │   ├── SuiviAdoption.java
│   │   │   │   └── TypeAnimal.java
│   │   │   ├── service/
│   │   │   │   ├── AnimalService.java
│   │   │   │   ├── AdoptantService.java
│   │   │   │   ├── DemandeAdoptionService.java
│   │   │   │   ├── SuiviAdoptionService.java
│   │   │   │   └── TypeAnimalService.java
│   │   │   └── depot/
│   │   │       ├── AnimalDepot.java
│   │   │       ├── AdoptantDepot.java
│   │   │       ├── DemandeAdoptionDepot.java
│   │   │       ├── SuiviAdoptionDepot.java
│   │   │       └── TypeAnimalDepot.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── schema.sql
│   │       └── static/
│   │           ├── accueil.html
│   │           ├── accueil.js
│   │           ├── accueil.css
│   │           ├── administration.html
│   │           ├── administration.js
│   │           ├── administration.css
│   │           ├── app.js
│   │           ├── login.html
│   │           ├── login.js
│   │           └── styles.css
└── uploads/
```

## 🔧 Prérequis

- Java JDK 11 ou supérieur
- Maven 3.6+
- MySQL 5.7+ (XAMPP ou autre)

## 🚀 Installation et exécution

1. Ouvrir le dossier du projet :

```bash
cd c:\xampp\htdocs\examenSpring
```

2. Compiler le projet :

```bash
mvn clean install
```

3. Démarrer l’application :

```bash
mvn spring-boot:run
```

4. Ouvrir le navigateur :

- Page publique : `http://localhost:8080/`
- Page d’administration : `http://localhost:8080/administration.html`

## ⚙️ Configuration MySQL

Les paramètres se trouvent dans `src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/examen_spring?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

## 🌐 Endpoints REST

### Animaux
```
GET    /api/animaux
GET    /api/animaux/{id}
GET    /api/animaux/type/{idType}
POST   /api/animaux
PUT    /api/animaux/{id}
DELETE /api/animaux/{id}
POST   /api/animaux/upload
```

### Types d’animaux
```
GET    /api/types
GET    /api/types/{id}
POST   /api/types
PUT    /api/types/{id}
DELETE /api/types/{id}
```

### Adoptants
```
GET    /api/adoptants
GET    /api/adoptants/{id}
POST   /api/adoptants
PUT    /api/adoptants/{id}
DELETE /api/adoptants/{id}
```

### Demandes d’adoption
```
GET    /api/demandes
GET    /api/demandes/{id}
POST   /api/demandes
PUT    /api/demandes/{id}
DELETE /api/demandes/{id}
```

### Suivis post-adoption
```
GET    /api/suivis
GET    /api/suivis/{id}
GET    /api/suivis/demande/{idDemande}
POST   /api/suivis
PUT    /api/suivis/{id}
DELETE /api/suivis/{id}
```

## 📌 Points importants

- `/` redirige vers `accueil.html` via `RootController`
- L’admin doit se connecter via `login.html` avant d’accéder à `administration.html`.
- La session d’admin est stockée dans `localStorage` sous `adoptantSession`.
- `administration.html` est protégée côté frontend par un contrôle `role === 'admin'`.
- Les fichiers uploadés sont exposés via `/uploads/**` grâce à `UploadConfig`
- Le champ d’upload doit s’appeler `file`
- Le dossier `uploads/` doit exister et être accessible en écriture

## 🧩 Documentation des fichiers JavaScript

### `src/main/resources/static/login.js`
- Gère le formulaire de connexion administrateur.
- Envoie un POST JSON vers `/api/adoptants/login` avec `email` et `motDePasse`.
- Stocke le résultat dans `localStorage` sous `adoptantSession`.
- Redirige vers `administration.html` en cas de succès.
- Affiche un message d’erreur en cas d’identifiants invalides ou d’erreur réseau.

### `src/main/resources/static/accueil.js`
- Contient l’état de l’application d’accueil et les données chargées depuis le backend.
- Définit des helpers DOM pour récupérer les éléments, afficher/masquer les modales et lire les valeurs de champs.
- Charge les animaux et les adoptants via `/api/animaux` et `/api/adoptants`.
- Crée et affiche dynamiquement les cartes d’animaux, les filtres et les listes d’adoptants.
- Gère le panier de demande d’adoption et l’envoi des demandes via POST `/api/demandes`.
- Implémente la sélection d’un adoptant et la création d’un nouvel adoptant.
- Met à jour les panneaux utilisateur selon la session et les demandes de l’adoptant connecté.

### `src/main/resources/static/administration.js`
- Gère l’interface d’administration côté client.
- Charge toutes les ressources d’administration : animaux, types, adoptants, demandes, suivis.
- Calcule des statistiques, met en évidence le menu actif et affiche plusieurs pages administratives.
- Affiche le tableau de bord, la liste des animaux, des demandes, des adoptants, des suivis et des types.
- Implémente des modales et formulaires pour modifier les demandes et les animaux.
- Vérifie la présence d’une session admin valide dans `localStorage` avant de démarrer.
- Redirige vers `login.html` si l’utilisateur n’est pas authentifié ou si le rôle n’est pas `admin`.

### `src/main/resources/static/app.js`
- Implémente un mini SPA interne avec rendu conditionnel des pages `home`, `admin`, `about`.
- Stocke l’état global, gère la navigation et met à jour le document title.
- Définit des helpers pour afficher les messages et changer de page.
- Supporte les opérations du panier : ajout, suppression et validation de demandes.
- Charge les jeux de données principaux depuis plusieurs endpoints REST.
- Contient des fonctions d’administration simplifiées : création et mise à jour d’animaux.

## 🎨 Documentation des fichiers CSS

### `src/main/resources/static/accueil.css`
- Définit les styles de l’accueil public : header, hero, grille, cartes et modales.
- Utilise des variables CSS pour les couleurs, les bordures et la mise en page.
- Met en forme les cartes d’animaux et les boutons d’action de la page principale.
- Gère l’affichage des modales de demande et d’adoptant.

### `src/main/resources/static/administration.css`
- Définit la structure du tableau de bord admin avec une barre latérale fixe et une zone de contenu.
- Stylise la navigation latérale, le header, les actions et les tableaux.
- Applique des styles aux formulaires, aux modales et aux indicateurs de statut.
- Comprend des media queries pour adapter l’interface sur tablettes et mobiles.

### `src/main/resources/static/styles.css`
- Fournit le style global de l’application : palette de couleurs, typographie, cartes, boutons et layout.
- Style les composants génériques réutilisables des pages publiques et d’administration.
- Gère la présentation des listes, des badges et des cartes responsives.

## 📑 Exemple d’upload d’image

```bash
curl -F "file=@C:/chemin/vers/image.jpg" http://localhost:8080/api/animaux/upload
```

## 🧠 Schéma de base de données

Le projet utilise ces tables :

- `type_animal`
- `animal`
- `adoptant`
- `demande_adoption`
- `suivi_adoption`

Le schéma est défini dans `src/main/resources/schema.sql`.

## 🛠️ Dépannage

### Port déjà utilisé

```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

### Problème JAVA_HOME

```powershell
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot"
```

### Problème de connexion MySQL

- Vérifier que MySQL est démarré via XAMPP
- Vérifier que le port 3306 est disponible
- Vérifier que la base `examen_spring` existe

## 📚 Ressources

- [Documentation Spring Boot](https://spring.io/projects/spring-boot)
- [Spring JDBC](https://spring.io/guides/gs/relational-data-access/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [SimpleFlatMapper](https://simpleflatmapper.org/)

