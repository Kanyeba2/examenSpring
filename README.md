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
- Les fichiers uploadés sont exposés via `/uploads/**` grâce à `UploadConfig`
- Le champ d’upload doit s’appeler `file`
- Le dossier `uploads/` doit exister et être accessible en écriture

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

