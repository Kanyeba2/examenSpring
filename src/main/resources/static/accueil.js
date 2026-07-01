async function chargerAnimauxEtAdoptants() {
    try {
        const [respAnimaux, respAdoptants] = await Promise.all([
            fetch('/api/animaux'),
            fetch('/api/adoptants')
        ]);
        const animaux = respAnimaux.ok ? await respAnimaux.json() : [];
        const adoptants = respAdoptants.ok ? await respAdoptants.json() : [];
        return { animaux, adoptants };
    } catch (e) {
        console.error(e);
        return { animaux: [], adoptants: [] };
    }
}

function remplirFiltres(animaux) {
    const especeSet = new Set();
    const ageSet = new Set();
    const tailleSet = new Set();
    const lieuSet = new Set();
    animaux.forEach(a => {
        if (a.nomTypeAnimal) especeSet.add(a.nomTypeAnimal);
        if (a.age) ageSet.add(a.age);
        if (a.taille) tailleSet.add(a.taille);
        if (a.lieu) lieuSet.add(a.lieu);
    });
    const toSelect = (id, set) => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = '<option value="">' + sel.firstElementChild.textContent + '</option>' + [...set].map(v => `<option value="${v}">${v}</option>`).join('');
    };
    toSelect('filtre-espece', especeSet);
    toSelect('filtre-age', ageSet);
    toSelect('filtre-taille', tailleSet);
    toSelect('filtre-lieu', lieuSet);
}

function applyFiltre(animaux, adoptants) {
    const q = (document.getElementById('recherche') ? .value || '').toLowerCase().trim();
    const espece = document.getElementById('filtre-espece') ? .value || '';
    const age = document.getElementById('filtre-age') ? .value || '';
    const taille = document.getElementById('filtre-taille') ? .value || '';
    const lieu = document.getElementById('filtre-lieu') ? .value || '';
    const grille = document.getElementById('grille-animaux');
    grille.innerHTML = '';
    const filtres = animaux.filter(a => {
        if (q) {
            const txt = `${a.nom} ${a.nomTypeAnimal || ''} ${a.description || ''}`.toLowerCase();
            if (!txt.includes(q)) return false;
        }
        if (espece && a.nomTypeAnimal !== espece) return false;
        if (age && String(a.age) !== String(age)) return false;
        if (taille && a.taille !== taille) return false;
        if (lieu && a.lieu !== lieu) return false;
        return true;
    });
    filtres.forEach(a => grille.appendChild(creerCarte(a)));
    // Re-fill filters based on full dataset
    remplirFiltres(animaux);
}

function creerCarte(animal) {
    const div = document.createElement('article');
    div.className = 'carte-animal';
    div.innerHTML = `
        <div class="photo"><img src="${animal.photoUrl || '/uploads/default.png'}" alt="${animal.nom}"></div>
        <div class="card-body">
            <div style="display:flex;justify-content:space-between;align-items:center">
                <h3>${animal.nom}</h3>
                <button class="fav-button" title="Ajouter aux favoris">♡</button>
            </div>
            <div class="card-meta"><div>${animal.nomTypeAnimal || ''}</div><div><strong>${animal.age || ''} ans</strong></div></div>
            <p style="color:var(--texte);font-size:0.95rem">${(animal.description||'').slice(0,140)}</p>
            <div class="card-actions">
                <button class="button-demande" data-id="${animal.idAnimal}">Demander</button>
                <small style="color:#6b7280">${animal.statut || 'disponible'}</small>
            </div>
        </div>
    `;
    return div;
}

function ouvrirModalDemande(animal, adoptants) {
    const modal = document.getElementById('modal-demande');
    document.getElementById('modal-animal').value = animal.nom;
    const select = document.getElementById('modal-adoptant');
    select.innerHTML = adoptants.map(a => `<option value="${a.idAdoptant}">${a.prenom} ${a.nom} (${a.email})</option>`).join('');
    modal.classList.remove('hidden');
    modal.dataset.idAnimal = animal.idAnimal;
}

function fermerModal() {
    const modal = document.getElementById('modal-demande');
    modal.classList.add('hidden');
    modal.dataset.idAnimal = '';
    document.getElementById('modal-message').value = '';
}

async function envoyerDemande() {
    const modal = document.getElementById('modal-demande');
    const idAnimal = parseInt(modal.dataset.idAnimal, 10);
    const idAdoptant = parseInt(document.getElementById('modal-adoptant').value, 10);
    const message = document.getElementById('modal-message').value;
    if (!idAnimal || !idAdoptant) { alert('Sélection manquante'); return; }

    const charge = { idAnimal, idAdoptant, dateDemande: new Date().toISOString(), statut: 'nouvelle', message };
    try {
        const resp = await fetch('/api/demandes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(charge) });
        if (resp.ok) {
            alert('Demande envoyée');
            fermerModal();
        } else {
            const txt = await resp.text();
            alert('Erreur: ' + txt);
        }
    } catch (e) {
        alert('Erreur réseau');
        console.error(e);
    }
}

document.addEventListener('DOMContentLoaded', async() => {
    const { animaux, adoptants } = await chargerAnimauxEtAdoptants();
    const grille = document.getElementById('grille-animaux');
    // initial render
    animaux.forEach(animal => grille.appendChild(creerCarte(animal)));
    // populate filters
    remplirFiltres(animaux);

    // user via DB: allow selection or creation using API
    let currentAdoptant = null;
    const mesDemandesBox = document.getElementById('mes-demandes-list');
    const monAdoptionBox = document.getElementById('mon-adoption');

    async function chargerAdoptantsEtRemplirSelect() {
        const resp = await fetch('/api/adoptants');
        const list = resp.ok ? await resp.json() : [];
        const sel = document.getElementById('adoptant-select');
        if (sel) {
            sel.innerHTML = '<option value="">-- Choisir un adoptant --</option>' + list.map(a => `<option value="${a.idAdoptant}">${a.prenom} ${a.nom} (${a.email})</option>`).join('');
        }
        return list;
    }

    async function refreshPanels() {
        // if no adoptant selected, show CTA
        if (!currentAdoptant) {
            mesDemandesBox.innerHTML = `<div>Sélectionnez votre profil pour voir vos demandes.<br/><button id="ouvrir-modal-adoptant">Se connecter / Créer un profil</button></div>`;
            monAdoptionBox.innerHTML = `Aucune adoption en cours.`;
            const ouvrirBtn = document.getElementById('ouvrir-modal-adoptant');
            if (ouvrirBtn) ouvrirBtn.addEventListener('click', () => document.getElementById('modal-adoptant').classList.remove('hidden'));
            // wire modal actions
            const fermerBtn = document.getElementById('fermer-modal-adoptant');
            if (fermerBtn) fermerBtn.addEventListener('click', () => document.getElementById('modal-adoptant').classList.add('hidden'));
            const annulerBtn = document.getElementById('annuler-modal-adoptant');
            if (annulerBtn) annulerBtn.addEventListener('click', () => document.getElementById('modal-adoptant').classList.add('hidden'));
            const seConnecterBtn = document.getElementById('adoptant-se-connecter');
            if (seConnecterBtn) seConnecterBtn.addEventListener('click', () => {
                    const id = parseInt(document.getElementById('adoptant-select').value, 10);
                    if (id) {
                        // set currentAdoptant from API
                        fetch(`/api/adoptants/${id}`).then(r => r.ok ? r.json() : null).then(a => {
                            currentAdoptant = a;
                        });
                        const creerBtn = document.getElementById('creer-modal-adoptant');
                        if (creerBtn) creerBtn.addEventListener('click', async() => {
                            const nom = document.getElementById('adoptant-nom').value.trim();
                            if (!nom) { alert('Nom requis'); return; }
                            const prenom = document.getElementById('adoptant-prenom').value.trim();
                            const email = document.getElementById('adoptant-email').value.trim();
                            const telephone = document.getElementById('adoptant-telephone').value.trim();
                            const charge = { nom, prenom, email, telephone, role: 'adoptant' };
                            try {
                                const resp = await fetch('/api/adoptants', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(charge) });
                                if (resp.ok) {
                                    // reload adoptants list and select new
                                    const list = await chargerAdoptantsEtRemplirSelect();
                                    const nouvel = list[list.length - 1];
                                    currentAdoptant = nouvel;
                                    document.getElementById('modal-adoptant').classList.add('hidden');
                                    refreshPanels();
                                } else { alert('Erreur création adoptant'); }
                            } catch (e) { alert('Erreur réseau'); }
                        });
                        const nouvel = list[list.length - 1];
                        currentAdoptant = nouvel;
                        document.getElementById('modal-adoptant').classList.add('hidden');
                        refreshPanels();
                    } else { alert('Erreur création adoptant'); }
                } catch (e) { alert('Erreur réseau'); }
            });
        // fill selects
        await chargerAdoptantsEtRemplirSelect();
    } else {
        // load demandes for this adoptant
        const resp = await fetch('/api/demandes');
        const demandes = resp.ok ? await resp.json() : [];
        const mes = demandes.filter(d => d.idAdoptant === currentAdoptant.idAdoptant);
        if (mes.length === 0) mesDemandesBox.innerHTML = '<div>Aucune demande envoyée.</div>';
        else mesDemandesBox.innerHTML = mes.map(d => `<div style="padding:6px 0;border-bottom:1px solid #f1f5f9">${d.nomAnimal||'Animal'} — ${new Date(d.dateDemande).toLocaleDateString()} <span style="float:right">${d.statut}</span></div>`).join('');

        const adoptee = demandes.find(d => d.idAdoptant === currentAdoptant.idAdoptant && d.statut && d.statut.toLowerCase().includes('accep'));
        if (adoptee) monAdoptionBox.innerHTML = `<div><strong>${adoptee.nomAnimal}</strong><div>Adopté — ${new Date(adoptee.dateDecision||Date.now()).toLocaleDateString()}</div></div>`;
        else monAdoptionBox.innerHTML = 'Aucune adoption en cours.';
    }
}
// initial load adoptants
await chargerAdoptantsEtRemplirSelect(); refreshPanels();

// search & filters
const inputRecherche = document.getElementById('recherche');
const btnRechercher = document.getElementById('btn-rechercher'); btnRechercher.addEventListener('click', () => applyFiltre(animaux, adoptants)); inputRecherche.addEventListener('keyup', (e) => { if (e.key === 'Enter') applyFiltre(animaux, adoptants); });

// delegate demande clicks
grille.addEventListener('click', (e) => {
    const btn = e.target.closest('.button-demande');
    if (!btn) return;
    const id = parseInt(btn.dataset.id, 10);
    const animal = animaux.find(a => a.idAnimal === id);
    ouvrirModalDemande(animal, adoptants);
});

document.getElementById('fermer-modal').addEventListener('click', fermerModal); document.getElementById('annuler-modal').addEventListener('click', fermerModal); document.getElementById('envoyer-demande').addEventListener('click', envoyerDemande);
});