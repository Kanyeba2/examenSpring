# 📮 Guide Postman - Tester l'API

## Installation de Postman

1. Télécharger depuis: https://www.postman.com/downloads/
2. Installer et lancer l'application
3. Créer un compte (optionnel mais recommandé)

## Créer une Collection de Requêtes

### Étape 1: Créer une nouvelle Collection
1. Cliquer sur **+ New** en haut à gauche
2. Sélectionner **Collection**
3. Nommer la collection: `Examen Spring API`
4. Cliquer sur **Create**

### Étape 2: Ajouter une Requête Dossier

Pour organiser, créer des dossiers:
```
Examen Spring API
├── Catégories
├── Produits
├── Commandes
└── Lignes de Commande
```

Pour créer un dossier:
1. Faire clic droit sur la collection
2. Sélectionner **Add Folder**
3. Nommer le dossier

## Configurer les Variables d'Environnement

### Créer un Environnement

1. Cliquer sur l'icône **Environnements** (engrenage)
2. Cliquer sur **Créer un nouvel environnement**
3. Nommer: `Local Development`
4. Ajouter les variables:

```
Variable              | Valeur
--------------------|-------------------------
base_url             | http://localhost:8080
categorie_id         | 1
produit_id           | 1
commande_id          | 1
```

5. Cliquer **Save**

Maintenant utiliser `{{base_url}}` dans les URLs!

## Exemples de Requêtes Postman

### 📂 GET - Lister les Catégories

```
Méthode:  GET
URL:      {{base_url}}/api/categories
Headers:  Accept: application/json
Corps:    (vide)
```

### 📂 GET - Récupérer une Catégorie

```
Méthode:  GET
URL:      {{base_url}}/api/categories/{{categorie_id}}
Headers:  Accept: application/json
Corps:    (vide)
```

### 📂 POST - Créer une Catégorie

```
Méthode:  POST
URL:      {{base_url}}/api/categories
Headers:  Content-Type: application/json
Corps (JSON):
{
  "nomCategorie": "Électronique Nouvelle",
  "description": "Produits électroniques dernière génération"
}
```

### 📦 POST - Créer un Produit

```
Méthode:  POST
URL:      {{base_url}}/api/produits
Headers:  Content-Type: application/json
Corps (JSON):
{
  "nomProduit": "Smartphone Samsung S24",
  "prix": 999.99,
  "quantiteStock": 15,
  "idCategorie": 1
}
```

### 🛒 POST - Créer une Commande

```
Méthode:  POST
URL:      {{base_url}}/api/commandes
Headers:  Content-Type: application/json
Corps (JSON):
{
  "numeroCommande": "CMD-2024-200",
  "dateCommande": "2024-01-25T10:30:00",
  "montantTotal": 1999.98,
  "statut": "EN_COURS",
  "nombreArticles": 2
}
```

### 🔗 GET - Récupérer les Lignes d'une Commande (JOINTURE)

```
Méthode:  GET
URL:      {{base_url}}/api/commandes/{{commande_id}}/lignes
Headers:  Accept: application/json
Corps:    (vide)
```

Réponse attendue:
```json
[
  {
    "idLigneCommande": 1,
    "idCommande": 1,
    "idProduit": 1,
    "quantite": 2,
    "prixUnitaire": 1299.99,
    "sousTotal": 2599.98,
    "nomProduit": "Laptop Dell XPS 13"
  }
]
```

### 🔗 POST - Ajouter une Ligne à une Commande

```
Méthode:  POST
URL:      {{base_url}}/api/commandes/{{commande_id}}/lignes
Headers:  Content-Type: application/json
Corps (JSON):
{
  "idProduit": 3,
  "quantite": 1,
  "prixUnitaire": 149.99,
  "sousTotal": 149.99
}
```

### ✏️ PUT - Mettre à Jour une Catégorie

```
Méthode:  PUT
URL:      {{base_url}}/api/categories/{{categorie_id}}
Headers:  Content-Type: application/json
Corps (JSON):
{
  "nomCategorie": "Électronique Premium",
  "description": "Produits de luxe et haute performance"
}
```

### ❌ DELETE - Supprimer une Catégorie

```
Méthode:  DELETE
URL:      {{base_url}}/api/categories/{{categorie_id}}
Headers:  Accept: application/json
Corps:    (vide)
```

## 🔄 Flux de Test Complet

Suivre cet ordre pour tester l'application:

### 1. Tester les Catégories
```
1. GET    /api/categories         (voir les catégories existantes)
2. POST   /api/categories         (créer une nouvelle)
3. GET    /api/categories/1       (récupérer la première)
4. PUT    /api/categories/1       (mettre à jour)
5. DELETE /api/categories/{id}    (supprimer)
```

### 2. Tester les Produits
```
1. GET    /api/produits                      (liste tous)
2. POST   /api/produits                      (créer avec une catégorie)
3. GET    /api/produits/1                    (récupérer un)
4. GET    /api/produits/categorie/1          (par catégorie - JOINTURE)
5. PUT    /api/produits/1                    (mettre à jour)
6. DELETE /api/produits/{id}                 (supprimer)
```

### 3. Tester les Commandes
```
1. GET    /api/commandes                     (liste tous)
2. POST   /api/commandes                     (créer)
3. GET    /api/commandes/1                   (récupérer)
4. GET    /api/commandes/1/lignes            (voir les lignes - JOINTURE)
5. POST   /api/commandes/1/lignes            (ajouter un article)
6. PUT    /api/commandes/1                   (mettre à jour)
7. DELETE /api/commandes/{id}                (supprimer)
```

## 📊 Conseils d'Utilisation

### Sauvegarder les IDs Retournés

Si vous voyez une réponse comme:
```json
{
  "idCommande": 10,
  "numeroCommande": "CMD-2024-200"
}
```

Mettez à jour la variable d'environnement `commande_id` avec la valeur `10`

### Tester les Erreurs

Essayer des requêtes invalides:
```
- Créer un produit avec prix négatif → 400 Bad Request
- Récupérer un ID inexistant → 404 Not Found
- Supprimer deux fois le même → 404 Not Found
```

### Mode Test Auto (Optionnel)

Cliquer sur l'onglet **Tests** avant d'envoyer une requête pour écrire des assertions:

```javascript
// Vérifier le code de statut
pm.test("Statut 200", function () {
    pm.response.to.have.status(200);
});

// Vérifier une clé existe
pm.test("Réponse contient un ID", function () {
    pm.expect(pm.response.json()).to.have.property('idCategorie');
});
```

## 📝 Raccourcis Clavier Utiles

| Raccourci | Action |
|-----------|--------|
| `Ctrl + N` | Nouvelle requête |
| `Ctrl + Enter` | Envoyer |
| `Ctrl + S` | Sauvegarder |
| `Tab` | Auto-complétion |

## 🎯 Cas d'Usage Complets

### Scénario 1: Créer un Produit et l'Ajouter à une Commande

```
1. POST /api/categories
   → Obtenir idCategorie = 10

2. POST /api/produits (utiliser idCategorie = 10)
   → Obtenir idProduit = 50

3. POST /api/commandes
   → Obtenir idCommande = 20

4. POST /api/commandes/20/lignes (utiliser idProduit = 50)
   → Succès!

5. GET /api/commandes/20/lignes
   → Voir la jointure: nomProduit inclus
```

### Scénario 2: Afficher une Commande Complète

```
GET /api/commandes/1
↓ Puis ↓
GET /api/commandes/1/lignes
↓ Voir ↓
- Détails commande
- Tous les produits avec leurs noms (JOIN automatique)
```

---

**Bon testing! 🎉**

Pour des questions: Consulter le fichier `README.md`
