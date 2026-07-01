# Tests API - Commandes CURL

## 🌐 Configuration de Base
```
BASE_URL = http://localhost:8080
```

## ============================================================
## CATÉGORIES
## ============================================================

### 1️⃣ Lister toutes les catégories
```bash
curl -X GET http://localhost:8080/api/categories \
  -H "Accept: application/json"
```

### 2️⃣ Récupérer une catégorie par ID
```bash
curl -X GET http://localhost:8080/api/categories/1 \
  -H "Accept: application/json"
```

### 3️⃣ Créer une nouvelle catégorie
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "nomCategorie": "Électroménager",
    "description": "Appareils électroménagers pour la maison"
  }'
```

### 4️⃣ Mettre à jour une catégorie
```bash
curl -X PUT http://localhost:8080/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nomCategorie": "Électronique Avancée",
    "description": "Produits électroniques de haute qualité"
  }'
```

### 5️⃣ Supprimer une catégorie
```bash
curl -X DELETE http://localhost:8080/api/categories/1 \
  -H "Accept: application/json"
```

## ============================================================
## PRODUITS
## ============================================================

### 1️⃣ Lister tous les produits
```bash
curl -X GET http://localhost:8080/api/produits \
  -H "Accept: application/json"
```

### 2️⃣ Récupérer un produit par ID
```bash
curl -X GET http://localhost:8080/api/produits/1 \
  -H "Accept: application/json"
```

### 3️⃣ Lister les produits d'une catégorie (JOINTURE)
```bash
curl -X GET http://localhost:8080/api/produits/categorie/1 \
  -H "Accept: application/json"
```

### 4️⃣ Créer un nouveau produit
```bash
curl -X POST http://localhost:8080/api/produits \
  -H "Content-Type: application/json" \
  -d '{
    "nomProduit": "Tablette Samsung Galaxy Tab",
    "prix": 399.99,
    "quantiteStock": 10,
    "idCategorie": 1
  }'
```

### 5️⃣ Mettre à jour un produit
```bash
curl -X PUT http://localhost:8080/api/produits/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nomProduit": "Laptop Dell XPS 15",
    "prix": 1599.99,
    "quantiteStock": 8,
    "idCategorie": 1
  }'
```

### 6️⃣ Supprimer un produit
```bash
curl -X DELETE http://localhost:8080/api/produits/1 \
  -H "Accept: application/json"
```

## ============================================================
## COMMANDES
## ============================================================

### 1️⃣ Lister toutes les commandes
```bash
curl -X GET http://localhost:8080/api/commandes \
  -H "Accept: application/json"
```

### 2️⃣ Récupérer une commande par ID
```bash
curl -X GET http://localhost:8080/api/commandes/1 \
  -H "Accept: application/json"
```

### 3️⃣ Créer une nouvelle commande
```bash
curl -X POST http://localhost:8080/api/commandes \
  -H "Content-Type: application/json" \
  -d '{
    "numeroCommande": "CMD-2024-100",
    "dateCommande": "2024-01-20T14:30:00",
    "montantTotal": 1999.99,
    "statut": "EN_COURS",
    "nombreArticles": 2
  }'
```

### 4️⃣ Mettre à jour une commande
```bash
curl -X PUT http://localhost:8080/api/commandes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "numeroCommande": "CMD-2024-001",
    "dateCommande": "2024-01-20T14:30:00",
    "montantTotal": 2499.99,
    "statut": "LIVREE",
    "nombreArticles": 3
  }'
```

### 5️⃣ Supprimer une commande
```bash
curl -X DELETE http://localhost:8080/api/commandes/1 \
  -H "Accept: application/json"
```

## ============================================================
## LIGNES DE COMMANDE (avec JOINTURE)
## ============================================================

### 1️⃣ Récupérer les lignes d'une commande (JOIN à produit)
```bash
curl -X GET http://localhost:8080/api/commandes/1/lignes \
  -H "Accept: application/json"
```

Cela retournera:
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

### 2️⃣ Ajouter une ligne à une commande
```bash
curl -X POST http://localhost:8080/api/commandes/1/lignes \
  -H "Content-Type: application/json" \
  -d '{
    "idProduit": 3,
    "quantite": 2,
    "prixUnitaire": 149.99,
    "sousTotal": 299.98
  }'
```

## ============================================================
## TESTS DE VALIDATION
## ============================================================

### ❌ Créer une catégorie sans nom (doit échouer)
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "nomCategorie": "",
    "description": "Test"
  }'
```

### ❌ Créer un produit avec prix négatif (doit échouer)
```bash
curl -X POST http://localhost:8080/api/produits \
  -H "Content-Type: application/json" \
  -d '{
    "nomProduit": "Test",
    "prix": -10.00,
    "quantiteStock": 5,
    "idCategorie": 1
  }'
```

### ❌ Mettre à jour une commande inexistante (doit échouer)
```bash
curl -X PUT http://localhost:8080/api/commandes/9999 \
  -H "Content-Type: application/json" \
  -d '{
    "numeroCommande": "CMD-2024-999"
  }'
```

## 📝 Notes Importantes

1. **Format des Dates**: Utiliser le format ISO 8601
   - Exemple: `2024-01-20T14:30:00`

2. **Jointures Automatiques**: Les jointures sont faites automatiquement:
   - Produit inclut le nom de la catégorie
   - LigneCommande inclut le nom du produit

3. **Codes HTTP Attendus**:
   - 200: Succès (GET, PUT, DELETE)
   - 201: Créé (POST)
   - 400: Erreur de validation
   - 404: Non trouvé
   - 500: Erreur serveur

4. **IDs Générés Automatiquement**:
   - Les IDs primaires sont auto-incrémentés
   - Ne pas envoyer l'ID lors de la création

---

**Pour des tests plus faciles, utiliser Postman!**
