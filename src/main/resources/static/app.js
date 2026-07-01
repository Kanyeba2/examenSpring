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

const selectors = {
    primaryNav: document.querySelectorAll('[data-link]'),
    content: document.getElementById('app-content'),
    badgeCount: document.getElementById('cart-count'),
    message: document.getElementById('page-message'),
};

function formatStatut(statut) {
    if (!statut) return 'badge-new';
    if (statut === 'nouvelle') return 'badge-new';
    if (statut === 'en_cours') return 'badge-pending';
    if (statut === 'acceptée' || statut === 'acceptee') return 'badge-approved';
    if (statut === 'refusée' || statut === 'refusee') return 'badge-denied';
    return 'badge-new';
}

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

function renderNav() {
    selectors.primaryNav.forEach(link => {
        link.classList.toggle('active', link.dataset.page === state.page);
    });
    selectors.badgeCount.textContent = state.panier.length;
}

function buildAnimalCard(animal) {
    return `
    <li class="animal-card">
      <img src="${animal.photoUrl || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80'}" alt="${animal.nom}">
      <div class="animal-card-content">
        <div>
          <h3 class="animal-card-title">${animal.nom || 'Animal sans nom'}</h3>
          <p class="animal-card-body">${animal.description || 'Description indisponible.'}</p>
          <div class="details">
            <span class="chip">${animal.nomTypeAnimal || 'Type inconnu'}</span>
            <span class="chip">${animal.age ?? '?'} ans</span>
            <span class="chip">${animal.sexe || 'Sexe inconnu'}</span>
            <span class="chip">${animal.statut || 'Statut inconnu'}</span>
          </div>
        </div>
        <div>
          <button class="button" onclick="ajouterAuPanier(${animal.idAnimal})">Demande d'adoption</button>
        </div>
      </div>
    </li>
  `;
}

function buildTypeList() {
    if (!state.types.length) return '<li>Aucun type disponible.</li>';
    return state.types.map(type => `
    <li>
      <strong>${type.nomTypeAnimal}</strong>
      <p class="small">${type.description || 'Pas de description'}</p>
    </li>
  `).join('');
}

function buildCart() {
    if (!state.panier.length) {
        return '<div class="card"><p>Aucune demande dans le panier pour l’instant.</p></div>';
    }

    const items = state.panier.map((animal, index) => `
    <li class="card-list-item">
      <div class="meta">
        <strong>${animal.nom}</strong>
        <span class="chip">${animal.nomTypeAnimal || 'Type inconnu'}</span>
      </div>
      <div class="details">
        <span class="chip">${animal.age ?? '?'} ans</span>
        <span class="chip">${animal.sexe || 'Sexe inconnu'}</span>
      </div>
      <button class="button button-secondary" onclick="retirerDuPanier(${index})">Supprimer</button>
    </li>
  `).join('');

    return `
    <div class="card">
      <h2>Résumé de demande</h2>
      <p class="small">Vous pouvez envoyer une demande d'adoption pour les animaux sélectionnés.</p>
      <ul class="card-list">${items}</ul>
      <button class="button button-success" onclick="validerDemande()">Envoyer la demande</button>
    </div>
  `;
}

function renderHome() {
    document.title = 'Adoption d’animaux';
    selectors.content.innerHTML = `
    <section class="hero-card">
      <div class="section-title"><h2>Bienvenue sur la plateforme d'adoption</h2></div>
      <p>Découvrez des animaux à adopter, préparez vos demandes et suivez l'activité du refuge. Tout est géré via le backend Spring Boot et notre base de données.</p>
      <div class="meta">
        <span class="badge">${state.animaux.length} animaux</span>
        <span class="badge">${state.types.length} types</span>
        <span class="badge">${state.demandes.length} demandes</span>
      </div>
    </section>
    <section class="card">
      <div class="section-title"><h2>Animaux disponibles</h2><small>Choisissez un animal puis ajoutez-le au panier.</small></div>
      <ul class="card-list">${state.animaux.map(buildAnimalCard).join('')}</ul>
    </section>
    <section class="grid cards-grid">
      <div class="card">
        <h2>Types d'animaux</h2>
        <ul class="card-list">${buildTypeList()}</ul>
      </div>
      <div class="card">
        <h2>Panier de demandes</h2>
        ${buildCart()}
      </div>
    </section>
  `;
}

function ouvrirDetail(idAnimal) {
    const animal = state.animaux.find(a => a.idAnimal === idAnimal);
    if (!animal) return;
    state.page = 'detail';
    if (selectors.message) selectors.message.style.display = 'none';
    selectors.content.innerHTML = `
    <section class="card">
      <div class="section-title"><h2>${animal.nom || 'Détail animal'}</h2><small>${animal.nomTypeAnimal || ''}</small></div>
      <div class="animal-card" style="grid-template-columns:260px 1fr;">
        <img src="${animal.photoUrl || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=60'}" alt="${animal.nom}" style="width:260px;height:260px;object-fit:cover;border-radius:14px;">
        <div style="padding:18px;">
          <h3>${animal.nom}</h3>
          <p class="small">${animal.description || 'Pas de description fournie.'}</p>
          <div class="details" style="margin-top:12px;">
            <span class="chip">${animal.age ?? '?'} ans</span>
            <span class="chip">${animal.sexe || 'inconnu'}</span>
            <span class="chip">${animal.statut || 'statut'}</span>
          </div>
          <div style="margin-top:16px;display:flex;gap:8px;">
            <button class="button" onclick="ajouterAuPanier(${animal.idAnimal})">Ajouter au panier</button>
            <button class="button button-secondary" onclick="setPage('home')">Retour</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAdmin() {
    document.title = 'Administration';
    selectors.content.innerHTML = `
    <section class="card">
      <div class="section-title"><h2>Administration</h2><small>Gestion des animaux, des adoptants et des demandes.</small></div>
      <div class="grid-2">
        <div>
          <h3>Liste des demandes</h3>
          <table class="table">
            <thead>
              <tr><th>#</th><th>Animal</th><th>Adoptant</th><th>Statut</th><th>Date</th></tr>
            </thead>
            <tbody>
              ${state.demandes.map(d => `
                <tr>
                  <td>${d.idDemande}</td>
                  <td>${d.nomAnimal || 'N/A'}</td>
                  <td>${d.nomAdoptant || 'N/A'}</td>
                  <td><span class="badge-pill ${formatStatut(d.statut)}">${d.statut}</span></td>
                  <td>${d.dateDemande ? new Date(d.dateDemande).toLocaleDateString() : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Adoptants</h3>
          <ul class="card-list">
            ${state.adoptants.map(adoptant => `
              <li>
                <strong>${adoptant.prenom} ${adoptant.nom}</strong>
                <p class="small">${adoptant.email} • ${adoptant.telephone || 'Tel absent'}</p>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </section>
  `;
}

function renderAbout() {
  document.title = 'À propos';
  selectors.content.innerHTML = `
    <section class="card">
      <div class="section-title"><h2>À propos du système</h2><small>Notre plateforme d'adoption d'animaux</small></div>
      <p>Cette application montre une architecture propre en 3 couches : contrôleur, service et dépôt. Elle utilise Spring Boot avec JdbcTemplate pour interagir avec la base de données existante.</p>
      <ul class="card-list">
        <li>Gestion des animaux et de leurs types</li>
        <li>Gestion des adoptants</li>
        <li>Gestion des demandes d'adoption et des suivis</li>
        <li>Panier de demandes pour l'utilisateur</li>
      </ul>
    </section>
  `;
}

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

function retirerDuPanier(index) {
  state.panier.splice(index, 1);
  renderNav();
  renderPage();
}

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

// Admin: form to add animal (client-side only; calls backend POST /api/animaux)
function renderAdmin() {
  document.title = 'Administration';
  selectors.content.innerHTML = `
    <section class="card">
      <div class="section-title"><h2>Administration</h2><small>Gestion des animaux, des adoptants et des demandes.</small></div>
      <div class="grid-2">
        <div>
          <h3>Créer un animal</h3>
          <div class="form-grid">
            <label>Nom<input id="admin-nom"/></label>
            <label>Âge<input id="admin-age" type="number" min="0"/></label>
            <label>Sexe<select id="admin-sexe"><option value="mâle">mâle</option><option value="femelle">femelle</option></select></label>
            <label>Type<select id="admin-type">${state.types.map(t=>`<option value="${t.idTypeAnimal}">${t.nomTypeAnimal}</option>`).join('')}</select></label>
            <label>Image URL<input id="admin-photo" placeholder="https://..." /></label>
            <label>Description<textarea id="admin-desc"></textarea></label>
            <div style="display:flex;gap:8px;"><button class="button" onclick="adminCreerAnimal()">Créer</button><button class="button button-secondary" onclick="chargerDonnees().then(()=>renderPage())">Annuler</button></div>
          </div>
        </div>
        <div>
          <h3>Liste des animaux</h3>
          <table class="table">
            <thead><tr><th>#</th><th>Nom</th><th>Type</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              ${state.animaux.map(a=>`<tr><td>${a.idAnimal}</td><td>${a.nom}</td><td>${a.nomTypeAnimal||''}</td><td>${a.statut}</td><td><button class="button button-secondary" onclick="adminEditAnimal(${a.idAnimal})">Éditer</button></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

async function adminCreerAnimal() {
  const nom = document.getElementById('admin-nom').value;
  const age = parseInt(document.getElementById('admin-age').value,10) || 0;
  const sexe = document.getElementById('admin-sexe').value;
  const idType = parseInt(document.getElementById('admin-type').value,10) || null;
  const photo = document.getElementById('admin-photo').value || null;
  const desc = document.getElementById('admin-desc').value || null;
  const payload = { nom: nom, age: age, sexe: sexe, description: desc, statut: 'disponible', photoUrl: photo, idTypeAnimal: idType };
  try {
    const res = await fetch('/api/animaux', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if (res.ok) {
      await chargerDonnees();
      setMessage('success','Animal créé');
      renderPage();
    } else {
      const txt = await res.text(); setMessage('error', txt || 'Erreur création animal');
    }
  } catch (e) { setMessage('error','Erreur réseau'); }
}

function adminEditAnimal(id) {
  const a = state.animaux.find(x=>x.idAnimal===id);
  if (!a) return;
  selectors.content.innerHTML = `
    <section class="card">
      <h2>Éditer animal</h2>
      <div class="form-grid">
        <label>Nom<input id="edit-nom" value="${a.nom}"/></label>
        <label>Âge<input id="edit-age" type="number" value="${a.age}"/></label>
        <label>Sexe<select id="edit-sexe"><option ${a.sexe==='mâle'?'selected':''} value="mâle">mâle</option><option ${a.sexe==='femelle'?'selected':''} value="femelle">femelle</option></select></label>
        <label>Type<select id="edit-type">${state.types.map(t=>`<option ${t.idTypeAnimal===a.idTypeAnimal?'selected':''} value="${t.idTypeAnimal}">${t.nomTypeAnimal}</option>`).join('')}</select></label>
        <label>Image URL<input id="edit-photo" value="${a.photoUrl||''}"/></label>
        <label>Description<textarea id="edit-desc">${a.description||''}</textarea></label>
        <div style="display:flex;gap:8px;"><button class="button" onclick="adminSaveEdit(${a.idAnimal})">Enregistrer</button><button class="button button-secondary" onclick="renderPage()">Annuler</button></div>
      </div>
    </section>
  `;
}

async function adminSaveEdit(id) {
  const nom = document.getElementById('edit-nom').value;
  const age = parseInt(document.getElementById('edit-age').value,10) || 0;
  const sexe = document.getElementById('edit-sexe').value;
  const idType = parseInt(document.getElementById('edit-type').value,10) || null;
  const photo = document.getElementById('edit-photo').value || null;
  const desc = document.getElementById('edit-desc').value || null;
  const payload = { idAnimal: id, nom: nom, age: age, sexe: sexe, description: desc, statut: 'disponible', photoUrl: photo, idTypeAnimal: idType };
  try {
    const res = await fetch('/api/animaux/'+id, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if (res.ok) {
      await chargerDonnees();
      setMessage('success','Animal mis à jour');
      renderPage();
    } else { setMessage('error', await res.text()); }
  } catch (e) { setMessage('error','Erreur réseau'); }
}

async function initApp() {
  await chargerDonnees();
  renderPage();
}

window.setPage = setPage;
window.ajouterAuPanier = ajouterAuPanier;
window.retirerDuPanier = retirerDuPanier;
window.validerDemande = validerDemande;
window.onload = initApp;