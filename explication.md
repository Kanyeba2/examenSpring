

### Explication du projet
Ce fichier explique le rôle et le fonctionnement du code principal du projet. Il se concentre surtout sur les fichiers JavaScript et les points de connexion avec le backend Spring Boot.

### 1. src/main/resources/static/app.js
### 1.1. État global
```
const state = {
    animaux: [],
    types: [],
    adoptants: [],
    demandes: [],
    suivis: [],
    panier: [],
    page: 'home',
    message: null,
};
```
state contient les données partagées de l'application.
animaux, types, adoptants, demandes, suivis sont des tableaux remplis depuis le backend.
panier stocke les animaux sélectionnés pour une demande d'adoption.
page indique la page actuelle (home, admin, about).
message contient le texte à afficher dans la zone de notification<keep same>
- `state` contient les données partagées de l'application.
- `animaux`, `types`, `adoptants`, `demandes`, `suivis` sont des tableaux remplis depuis le backend.
- `panier` stocke les animaux sélectionnés pour une demande d'adoption.
- `page` indique la page actuelle (`home`, `admin`, `about`).
- `message` contient le texte à afficher dans la zone de notification.

```js
const selectors = {
    primaryNav: document.querySelectorAll('[data-link]'),
    content: document.getElementById('app-content'),
    badgeCount: document.getElementById('cart-count'),
    message: document.getElementById('page-message'),
};
```

- `selectors` référence les éléments HTML importants qui sont mis à jour dynamiquement.
- `primaryNav` sélectionne les liens de navigation qui portent l'attribut `data-link`.
- `content` est le conteneur principal où le HTML de chaque page est injecté.
- `badgeCount` montre le nombre d'articles dans le panier.
- `message` affiche les messages d'information ou d'erreur.

### 1.2. Fonctions utilitaires

```js
function formatStatut(statut) {
    if (!statut) return 'badge-new';
    if (statut === 'nouvelle') return 'badge-new';
    if (statut === 'en_cours') return 'badge-pending';
    if (statut === 'acceptée' || statut === 'acceptee') return 'badge-approved';
    if (statut === 'refusée' || statut === 'refusee') return 'badge-denied';
    return 'badge-new';
}
```

- `formatStatut` renvoie une classe CSS en fonction du statut d'une demande.
- Les statuts gérés sont `nouvelle`, `en_cours`, `acceptée`/`acceptee`, `refusée`/`refusee`.

```js
function setMessage(type, text) {
    if (!selectors.message) return;
    selectors.message.className = `message ${type}`;
    selectors.message.textContent = text;
    selectors.message.style.display = 'block';
}

function clearMessage() {
    if (!selectors.message) return;
    selectors.message.style.display = 'none';
}
```

- `setMessage` affiche un message de type `success` ou `error`.
- `clearMessage` masque l'alerte.

### 1.3. Navigation et rendu

```js
function renderNav() {
    selectors.primaryNav.forEach(link => {
        link.classList.toggle('active', link.dataset.page === state.page);
    });
    selectors.badgeCount.textContent = state.panier.length;
}
```

- met à jour le style du menu selon la page active.
- affiche le nombre d'animaux dans le panier.

```js
function renderPage() {
  clearMessage();
  renderNav();
  if (state.page === 'home') return renderHome();
  if (state.page === 'admin') return renderAdmin();
  if (state.page === 'about') return renderAbout();
}

function setPage(page) {
  state.page = page;
  renderPage();
}
```

- `renderPage` choisit le contenu à afficher selon `state.page`.
- `setPage` change la page et relance le rendu.

### 1.4. Rendu de la page d'accueil

```js
function renderHome() {
    document.title = 'Adoption d’animaux';
    selectors.content.innerHTML = `...`;
}
```

- `renderHome` remplace le HTML principal par la vue d'accueil.
- Elle affiche le nombre d'animaux, la liste des animaux, les types et le panier.
- La liste des animaux est construite par `buildAnimalCard`.

### 1.5. Cartes d'animaux

```js
function buildAnimalCard(animal) {
    return `...`;
}
```

- Crée une carte HTML par animal.
- `animal.photoUrl` est affiché si disponible, sinon une image par défaut Unsplash est utilisée.
- Affiche le nom, la description, le type, l'âge, le sexe et le statut.
- Le bouton appelle `ajouterAuPanier` avec `animal.idAnimal`.

### 1.6. Ajout et retrait du panier

```js
function ajouterAuPanier(idAnimal) {
  const animal = state.animaux.find(item => item.idAnimal === idAnimal);
  if (!animal) return;
  if (state.panier.some(item => item.idAnimal === idAnimal)) {
    setMessage('error', 'Cet animal est déjà dans le panier.');
    return;
  }
  state.panier.push(animal);
  renderNav();
  renderPage();
  setMessage('success', `« ${animal.nom} » a été ajouté au panier.`);
}
```

- Cherche l'animal correspondant à l'ID dans `state.animaux`.
- Si l'animal existe déjà dans le panier, affiche une erreur.
- Sinon, ajoute l'animal au panier, rafraîchit l'interface et affiche un message.

```js
function retirerDuPanier(index) {
  state.panier.splice(index, 1);
  renderNav();
  renderPage();
}
```

- Supprime l'élément du panier à son index.
- Recharge la navigation et la page.

### 1.7. Validation d'une demande

```js
async function validerDemande() {
  if (!state.panier.length) {
    setMessage('error', 'Ajoutez d’abord un animal au panier.');
    return;
  }
  const adoptantId = state.adoptants[0]?.idAdoptant || null;
  if (!adoptantId) {
    setMessage('error', 'Aucun adoptant n’est disponible pour envoyer la demande.');
    return;
  }

  try {
    for (const animal of state.panier) {
      await fetch('/api/demandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idAnimal: animal.idAnimal,
          idAdoptant: adoptantId,
          message: `Demande d'adoption pour ${animal.nom}`
        })
      });
    }
    state.panier = [];
    await chargerDonnees();
    setMessage('success', 'Vos demandes ont été envoyées.');
    renderNav();
    renderPage();
  } catch (error) {
    setMessage('error', 'Erreur lors de l’envoi des demandes.');
  }
}
```

- Valide que le panier n'est pas vide.
- Utilise le premier adoptant trouvé dans `state.adoptants` pour envoyer les demandes.
- Envoie une requête POST `/api/demandes` pour chaque animal.
- Vide le panier et recharge les données après envoi.

### 1.8. Chargement des données depuis le backend

```js
async function chargerDonnees() {
  const routes = [
    { key: 'animaux', url: '/api/animaux' },
    { key: 'types', url: '/api/types' },
    { key: 'adoptants', url: '/api/adoptants' },
    { key: 'demandes', url: '/api/demandes' },
    { key: 'suivis', url: '/api/suivis' }
  ];

  await Promise.all(routes.map(async ({ key, url }) => {
    const response = await fetch(url);
    state[key] = response.ok ? await response.json() : [];
  }));
}
```

- Récupère toutes les ressources nécessaires en parallèle.
- Remplit `state` avec les résultats JSON ou un tableau vide en cas d'erreur.

### 1.9. Administration en vue utilisateur

```js
function renderAdmin() { ... }
```

- Génère le HTML de la page d'administration.
- Affiche les demandes, les adoptants et un formulaire de création d'animaux.
- Utilise `state.demandes` et `state.adoptants` pour remplir les tableaux.

```js
async function adminCreerAnimal() { ... }
async function adminSaveEdit(id) { ... }
function adminEditAnimal(id) { ... }
```

- `adminCreerAnimal` lit les champs du formulaire admin, crée un payload JSON et POST vers `/api/animaux`.
- `adminEditAnimal` affiche un formulaire d'édition pré-rempli pour un animal donné.
- `adminSaveEdit` envoie un PUT vers `/api/animaux/{id}` pour mettre à jour l'animal.

### 1.10. Initialisation

```js
async function initApp() {
  await chargerDonnees();
  renderPage();
}

window.setPage = setPage;
window.ajouterAuPanier = ajouterAuPanier;
window.retirerDuPanier = retirerDuPanier;
window.validerDemande = validerDemande;
window.onload = initApp;
```

- `initApp` est exécuté au chargement de la page.
- Les fonctions sont exposées sur `window` pour pouvoir être appelées depuis le HTML généré.

---

## 2. `src/main/resources/static/administration.js`

### 2.1. État et sélection des éléments

```js
const etat = {
    animaux: [],
    types: [],
    adoptants: [],
    demandes: [],
    suivis: [],
    page: 'tableauDeBord',
    recherche: '',
};

const selecteurs = {
    contenu: document.getElementById('contenu-admin'),
    boutonMenu: document.getElementById('bouton-menu'),
    champRecherche: document.getElementById('champ-recherche'),
};
```

- `etat` contient les données et la page administrative active.
- `selecteurs` référence les éléments HTML du panneau d'administration.

### 2.2. Chargement des données

```js
async function chargerDonnees() {
    const routes = [
        { cle: 'animaux', url: '/api/animaux' },
        { cle: 'types', url: '/api/types' },
        { cle: 'adoptants', url: '/api/adoptants' },
        { cle: 'demandes', url: '/api/demandes' },
        { cle: 'suivis', url: '/api/suivis' },
    ];

    await Promise.all(routes.map(async({ cle, url }) => {
        try {
            const reponse = await fetch(url);
            etat[cle] = reponse.ok ? await reponse.json() : [];
        } catch (erreur) {
            etat[cle] = [];
        }
    }));
}
```

- Récupère l'ensemble des ressources de l'API.
- Chaque réponse est stockée dans `etat` selon sa clé.
- En cas d'erreur réseau, la clé devient un tableau vide.

### 2.3. Menu et statistiques

```js
function afficherMenuActif(page) { ... }
function calculerStatistiques() { ... }
```

- `afficherMenuActif` met en surbrillance l'onglet actif du menu.
- `calculerStatistiques` calcule des totaux pour les animaux, demandes, adoptants et adoptions.
- `parType` compte le nombre d'animaux par type.

### 2.4. Tableau de bord

```js
function afficherTableauDeBord() { ... }
```

- Affiche les indicateurs principaux : nombre d'animaux, demandes, adoptants et adoptions.
- Génère un tableau de demandes récentes.
- Affiche la répartition par type d'animal.
- Le graphique est un emplacement de conception.

### 2.5. Navigation des pages admin

```js
function afficherPage(page) { ... }
function changerPage(page) { afficherPage(page); }
```

- `afficherPage` choisit la page à afficher en fonction de `page`.
- Si la page n'est pas reconnue, elle retourne au tableau de bord.

### 2.6. Pages spécifiques

- `afficherPageAnimaux` affiche la liste des animaux et un bouton pour créer un animal.
- `afficherPageDemandes` affiche les demandes d'adoption et permet de cliquer pour ouvrir le détail.
- `afficherPageAdoptants` affiche la liste des adoptants.
- `afficherPageSuivi` affiche les suivis post-adoption.
- `afficherPageTypes` affiche la liste des types d'animaux.

### 2.7. Formulaire et actions animales

```js
function ouvrirFormulaireAnimal() { ... }
async function adminCreerAnimal() { ... }
function adminEditAnimal(id) { ... }
async function adminSaveEdit(id) { ... }
```

- `ouvrirFormulaireAnimal` affiche un formulaire de création d'animal.
- `adminCreerAnimal` lit les champs du formulaire, fabrique un `payload` JSON, et POSTe vers `/api/animaux`.
- `adminEditAnimal` pré-remplit un formulaire d'édition pour l'animal sélectionné.
- `adminSaveEdit` envoie les modifications au backend via PUT.

### 2.8. Initialisation et démarrage

```js
async function initApp() {
  await chargerDonnees();
  renderPage();
}
```

- Au démarrage, le script charge les données backend puis affiche la page admin par défaut.

---

## 3. `src/main/resources/static/accueil.js`

### 3.1. État et helpers

```js
const state = {
    animaux: [],
    adoptants: [],
    currentAdoptant: null
};

const $ = id => document.getElementById(id);
const valueOf = id => $(id)?.value?.trim() ?? '';
const show = id => { const el = $(id); if (el) el.classList.remove('hidden'); };
const hide = id => { const el = $(id); if (el) el.classList.add('hidden'); };
```

- `state` contient les animaux, adoptants et l'adoptant actuellement connecté.
- `$` est un raccourci pour `document.getElementById`.
- `valueOf` récupère et nettoie la valeur d'un champ.
- `show` et `hide` affichent ou masquent un élément.

### 3.2. Filtres dynamiques

```js
const filterFields = [
    { id: 'filtre-espece', key: 'nomTypeAnimal' },
    { id: 'filtre-age', key: 'age' },
    { id: 'filtre-taille', key: 'taille' },
    { id: 'filtre-lieu', key: 'lieu' }
];
```

- Liste les champs de filtre disponibles.
- `renderFilters` construit les options uniques à partir des animaux chargés.

### 3.3. Chargement des données

```js
async function fetchJson(url) {
    const resp = await fetch(url);
    if (!resp.ok) return [];
    return resp.json();
}

async function loadData() {
    const [animaux, adoptants] = await Promise.all([
        fetchJson('/api/animaux'),
        fetchJson('/api/adoptants')
    ]);
    state.animaux = animaux;
    state.adoptants = adoptants;
    renderFilters(animaux);
    renderAnimals(animaux);
    renderAdoptantSelects();
    await refreshPanels();
}
```

- `fetchJson` récupère un endpoint et renvoie un tableau vide si la requête échoue.
- `loadData` charge les animaux et adoptants, puis met à jour l'interface.

### 3.4. Affichage des animaux

```js
function renderAnimals(animaux) {
    const grille = $('grille-animaux');
    if (!grille) return;
    grille.innerHTML = '';
    animaux.forEach(animal => grille.appendChild(createCard(animal)));
}
```

- Vide la grille puis ajoute une carte par animal.

```js
function createCard(animal) { ... }
```

- Crée un élément `<article>` pour chaque animal.
- Inclut une image, le nom, le type, l'âge, une description et un bouton « Demander ».
- Le bouton possède `data-id` avec l'identifiant de l'animal.

### 3.5. Application des filtres

```js
function getFilters() {
    return {
        q: valueOf('recherche').toLowerCase(),
        espece: valueOf('filtre-espece'),
        age: valueOf('filtre-age'),
        taille: valueOf('filtre-taille'),
        lieu: valueOf('filtre-lieu')
    };
}

function applyFiltre() {
    const { q, espece, age, taille, lieu } = getFilters();
    const filtered = state.animaux.filter(animal => {
        if (q) {
            const text = `${animal.nom || ''} ${animal.nomTypeAnimal || ''} ${animal.description || ''}`.toLowerCase();
            if (!text.includes(q)) return false;
        }
        if (espece && animal.nomTypeAnimal !== espece) return false;
        if (age && String(animal.age) !== age) return false;
        if (taille && animal.taille !== taille) return false;
        if (lieu && animal.lieu !== lieu) return false;
        return true;
    });
    renderAnimals(filtered);
}
```

- Prend les valeurs des filtres et effectue un filtrage en mémoire sur `state.animaux`.
- Le texte libre recherche dans le nom, le type et la description.
- Les filtres exacts comparent les champs concernés.

### 3.6. Modales et demandes

```js
function openModal(id) { show(id); }
function closeModal(id) { hide(id); }

function openRequestModal(animal) { ... }
function resetRequestModal() { ... }
```

- Les fonctions de modal affichent ou ferment l'overlay.
- `openRequestModal` remplit le formulaire avec l'animal choisi et stocke l'ID dans `modal.dataset.idAnimal`.

```js
async function envoyerDemande() {
    const modal = $('modal-demande');
    if (!modal) return;
    const idAnimal = parseInt(modal.dataset.idAnimal || '', 10);
    const idAdoptant = parseInt(valueOf('modal-adoptant'), 10);
    const message = valueOf('modal-message');
    if (!idAnimal || !idAdoptant) {
        alert('Sélection manquante');
        return;
    }

    const payload = {
        idAnimal,
        idAdoptant,
        dateDemande: new Date().toISOString(),
        statut: 'nouvelle',
        message
    };

    try {
        const resp = await fetch('/api/demandes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (resp.ok) {
            alert('Demande envoyée');
            resetRequestModal();
            closeModal('modal-demande');
            await refreshPanels();
        } else {
            const errorText = await resp.text();
            alert('Erreur: ' + errorText);
        }
    } catch (error) {
        console.error(error);
        alert('Erreur réseau');
    }
}
```

- Envoie la demande d'adoption au backend.
- Valide que l'animal et l'adoptant sont sélectionnés.
- Après envoi, réinitialise et ferme la modale puis recharge les panneaux.

### 3.7. Gestion des adoptants

```js
async function renderAdoptantSelects() { ... }
async function setCurrentAdoptant(idAdoptant) { ... }
async function createAdoptant() { ... }
```

- `renderAdoptantSelects` remplit plusieurs listes déroulantes avec les adoptants.
- `setCurrentAdoptant` charge un adoptant dans `state.currentAdoptant` et met à jour l'interface.
- `createAdoptant` envoie un POST `/api/adoptants` pour créer un nouvel adoptant.

### 3.8. Rafraîchissement des panneaux

```js
async function refreshPanels() {
    const mesDemandesBox = $('mes-demandes-list');
    const monAdoptionBox = $('mon-adoption');
    if (!state.currentAdoptant) {
        renderNoAdoptantPanel();
        return;
    }

    const demandes = await fetchJson('/api/demandes');
    const mes = demandes.filter(d => d.idAdoptant === state.currentAdoptant.idAdoptant);
    if (mesDemandesBox) {
        mesDemandesBox.innerHTML = ...;
    }
    if (monAdoptionBox) {
        const adoptee = mes.find(d => d.statut && d.statut.toLowerCase().includes('accep'));
        monAdoptionBox.innerHTML = adoptee ? ... : 'Aucune adoption en cours.';
    }
}
```

- Si aucun adoptant n'est connecté, affiche un panneau invitant à se connecter.
- Sinon, charge toutes les demandes et filtre celles de l'adoptant courant.
- Affiche les demandes et le cas échéant l'adoption actuelle.

### 3.9. Actions liées aux événements DOM

```js
function bindActions() { ... }

function init() {
    bindActions();
    loadData().catch(error => console.error(error));
}

document.addEventListener('DOMContentLoaded', init);
```

- `bindActions` écoute les clics et saisies du formulaire.
- L'appel `DOMContentLoaded` démarre l'application lorsque le DOM est prêt.

---

## 4. `src/main/java/com/examen/controleur/AnimalControleur.java`

### 4.1. Annotations et injection

```java
@RestController
@RequestMapping("/api/animaux")
@CrossOrigin(origins = "*")
public class AnimalControleur {

    private final AnimalService animalService;

    public AnimalControleur(AnimalService animalService) {
        this.animalService = animalService;
    }
```

- `@RestController` indique que la classe expose des endpoints REST et retourne des objets JSON.
- `@RequestMapping("/api/animaux")` fixe la base de l'URL pour tous les endpoints.
- `@CrossOrigin(origins = "*")` autorise les requêtes depuis n'importe quelle origine, utile lors du développement frontend.
- `animalService` est injecté via le constructeur.

### 4.2. Endpoints GET

```java
@GetMapping
public ResponseEntity<List<Animal>> obtenirTout() {
    List<Animal> animaux = animalService.obtenirTout();
    return ResponseEntity.ok(animaux);
}

@GetMapping("/{id}")
public ResponseEntity<Animal> obtenirParId(@PathVariable Integer id) {
    Animal animal = animalService.obtenirParId(id);
    if (animal == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(animal);
}

@GetMapping("/type/{idType}")
public ResponseEntity<List<Animal>> obtenirParType(@PathVariable Integer idType) {
    List<Animal> animaux = animalService.obtenirParType(idType);
    return ResponseEntity.ok(animaux);
}
```

- `GET /api/animaux` renvoie tous les animaux.
- `GET /api/animaux/{id}` renvoie un animal par son identifiant.
- `GET /api/animaux/type/{idType}` renvoie les animaux d'un type précis.

### 4.3. Endpoint POST création

```java
@PostMapping
public ResponseEntity<String> creer(@RequestBody Animal animal) {
    try {
        boolean resultat = animalService.creer(animal);
        if (resultat) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Animal créé avec succès");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création de l'animal");
        }
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur : " + e.getMessage());
    }
}
```

- Attend un corps JSON converti en objet `Animal`.
- Appelle le service pour créer l'animal.
- Retourne 201 si tout va bien, 400 en cas de données invalides, 500 en cas d'erreur serveur.

### 4.4. Endpoint PUT mise à jour

```java
@PutMapping("/{id}")
public ResponseEntity<String> mettre_a_jour(@PathVariable Integer id, @RequestBody Animal animal) {
    animal.setIdAnimal(id);
    try {
        boolean resultat = animalService.mettre_a_jour(animal);
        if (resultat) {
            return ResponseEntity.ok("Animal mis à jour avec succès");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Animal non trouvé");
        }
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur : " + e.getMessage());
    }
}
```

- Fixe l'ID de l'animal avec la valeur passée dans l'URL.
- Appelle le service de mise à jour.
- Renvoie 404 si l'animal n'existe pas.

### 4.5. Endpoint DELETE suppression

```java
@DeleteMapping("/{id}")
public ResponseEntity<String> supprimer(@PathVariable Integer id) {
    try {
        boolean resultat = animalService.supprimer(id);
        if (resultat) {
            return ResponseEntity.ok("Animal supprimé avec succès");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Animal non trouvé");
        }
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Erreur : " + e.getMessage());
    }
}
```

- Supprime l'animal demandé.
- Retourne 404 si l'animal n'existe pas.

### 4.6. Upload d'image

```java
@PostMapping("/upload")
public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
    if (file == null || file.isEmpty()) {
        return ResponseEntity.badRequest().body("Aucun fichier reçu");
    }

    String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
    String extension = StringUtils.getFilenameExtension(originalFileName);
    if (extension == null) {
        return ResponseEntity.badRequest().body("Extension de fichier manquante");
    }

    String filename = UUID.randomUUID().toString() + "." + extension;
    Path uploadDirectory = Paths.get("uploads").toAbsolutePath().normalize();
    try {
        Files.createDirectories(uploadDirectory);
        if (!Files.isWritable(uploadDirectory)) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Le dossier uploads n'est pas accessible en écriture");
        }
        Path destination = uploadDirectory.resolve(filename);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
        }
        return ResponseEntity.ok("/uploads/" + filename);
    } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de l'enregistrement du fichier: " + e.getMessage());
    }
}
```

- `@RequestParam("file")` récupère le fichier uploadé par le frontend.
- Vérifie que le fichier existe et n'est pas vide.
- Nettoie le nom original et récupère son extension.
- Génère un nom de fichier unique avec `UUID`.
- Crée le dossier `uploads` s'il n'existe pas.
- Copie le flux du fichier vers le dossier en écrasant si nécessaire.
- Renvoie l'URL accessible du fichier.

---

## 5. `src/main/java/com/examen/controleur/UploadConfig.java`

```java
@Configuration
public class UploadConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
```

- `@Configuration` signifie que c'est une classe de configuration Spring.
- `addResourceHandlers` expose le dossier local `uploads/` via l'URL `/uploads/**`.
- Cela permet d'accéder aux images uploadées depuis le navigateur.

---

## 6. `src/main/java/com/examen/controleur/RootController.java`

```java
@Controller
public class RootController {

    @GetMapping("/")
    public String root() {
        return "redirect:/accueil.html";
    }
}
```

- `@Controller` indique un contrôleur MVC classique.
- `@GetMapping("/")` intercepte la racine du site.
- `return "redirect:/accueil.html";` redirige automatiquement l'utilisateur vers la page publique.

---

## 7. Comment tout fonctionne ensemble

1. Le navigateur charge `accueil.html` via la redirection de `RootController`.
2. `accueil.js` exécute `loadData()` au chargement de la page.
3. `loadData()` appelle les endpoints REST du backend pour remplir `state.animaux` et `state.adoptants`.
4. Le frontend affiche les cartes d'animaux et propose des filtres.
5. Lorsqu'un utilisateur clique sur "Demander", une modale s'ouvre et la demande est envoyée à `/api/demandes`.
6. `app.js` fournit une vue de type SPA pour l'accueil et la page admin.
7. `administration.js` est le script de l'interface d'administration qui gère les données de gestion et affiche plusieurs sections.
8. Le backend Spring Boot expose les routes REST et sauvegarde les données dans la base de données via les services et dépôts.
9. Les uploads d'images sont servis depuis le dossier `uploads/` grâce à `UploadConfig`.

---

## 8. Notes importantes

- Les fonctions JavaScript utilisent des templates littéraux pour générer du HTML dynamique.
- Les endpoints `fetch` sont majoritairement `GET`, `POST` et `PUT`.
- Le code admin n'utilise pas de framework JS : il manipule directement le DOM.
- Les fichiers uploadés doivent être accessibles en écriture par le serveur.
- La gestion du panier dans `app.js` est uniquement côté client.

---

## 9. Conseils de lecture

- Vérifiez la présence des éléments HTML avec les bons `id` et `data-link` dans `accueil.html` et `administration.html`.
- Les noms de champs JSON (`idAnimal`, `idAdoptant`, `statut`, `message`) doivent correspondre aux propriétés attendues côté backend.
- Si vous souhaitez étendre la fonctionnalité, commencez par ajouter des méthodes dans `AnimalControleur` et adaptez les appels `fetch` en JS.
