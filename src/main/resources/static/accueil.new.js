const state = {
    animaux: [],
    adoptants: [],
    currentAdoptant: null
};

const $ = id => document.getElementById(id);
const valueOf = id => $(id) ? .value ? .trim() ? ? '';
const show = id => { const el = $(id); if (el) el.classList.remove('hidden'); };
const hide = id => { const el = $(id); if (el) el.classList.add('hidden'); };

const filterFields = [
    { id: 'filtre-espece', key: 'nomTypeAnimal' },
    { id: 'filtre-age', key: 'age' },
    { id: 'filtre-taille', key: 'taille' },
    { id: 'filtre-lieu', key: 'lieu' }
];

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

function renderAnimals(animaux) {
    const grille = $('grille-animaux');
    if (!grille) return;
    grille.innerHTML = '';
    animaux.forEach(animal => grille.appendChild(createCard(animal)));
}

function createCard(animal) {
    const article = document.createElement('article');
    article.className = 'carte-animal';
    article.innerHTML = `
        <div class="photo"><img src="${animal.photoUrl || '/uploads/default.png'}" alt="${animal.nom || ''}"></div>
        <div class="card-body">
            <div class="card-header">
                <h3>${animal.nom || ''}</h3>
                <button class="fav-button" title="Ajouter aux favoris">♡</button>
            </div>
            <div class="card-meta"><div>${animal.nomTypeAnimal || ''}</div><div><strong>${animal.age || ''} ans</strong></div></div>
            <p>${(animal.description || '').slice(0, 140)}</p>
            <div class="card-actions">
                <button class="button-demande" data-id="${animal.idAnimal}">Demander</button>
                <small>${animal.statut || 'disponible'}</small>
            </div>
        </div>
    `;
    return article;
}

function renderFilters(animaux) {
    filterFields.forEach(field => {
        const select = $(field.id);
        if (!select) return;
        const values = [...new Set(animaux.map(item => item[field.key]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), 'fr', { numeric: true }));
        const placeholder = select.firstElementChild ? .textContent || '-- Choisir --';
        select.innerHTML = `<option value="">${placeholder}</option>` + values.map(value => `<option value="${value}">${value}</option>`).join('');
    });
}

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

function renderAdoptantSelects() {
    ['adoptant-select', 'modal-adoptant'].forEach(id => {
        const select = $(id);
        if (!select) return;
        select.innerHTML = '<option value="">-- Choisir un adoptant --</option>' + state.adoptants.map(a => `<option value="${a.idAdoptant}">${a.prenom} ${a.nom} (${a.email})</option>`).join('');
    });
}

function openModal(id) {
    show(id);
}

function closeModal(id) {
    hide(id);
}

function openRequestModal(animal) {
    const modal = $('modal-demande');
    if (!modal) return;
    $('modal-animal').value = animal.nom || '';
    modal.dataset.idAnimal = animal.idAnimal;
    renderAdoptantSelects();
    openModal('modal-demande');
}

function resetRequestModal() {
    const modal = $('modal-demande');
    if (!modal) return;
    modal.dataset.idAnimal = '';
    $('modal-animal').value = '';
    $('modal-message').value = '';
}

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

async function loadAdoptants() {
    state.adoptants = await fetchJson('/api/adoptants');
    renderAdoptantSelects();
}

async function setCurrentAdoptant(idAdoptant) {
    const adoptant = state.adoptants.find(a => a.idAdoptant === idAdoptant);
    if (adoptant) {
        state.currentAdoptant = adoptant;
        await refreshPanels();
        return;
    }

    const resp = await fetch(`/api/adoptants/${idAdoptant}`);
    if (resp.ok) {
        state.currentAdoptant = await resp.json();
        await refreshPanels();
    }
}

async function createAdoptant() {
    const nom = valueOf('adoptant-nom');
    const prenom = valueOf('adoptant-prenom');
    const email = valueOf('adoptant-email');
    const telephone = valueOf('adoptant-telephone');
    if (!nom || !prenom || !email) {
        alert('Nom, prénom et email sont requis');
        return;
    }

    const payload = { nom, prenom, email, telephone, role: 'adoptant' };
    try {
        const resp = await fetch('/api/adoptants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!resp.ok) {
            const errorText = await resp.text();
            alert('Erreur création adoptant: ' + errorText);
            return;
        }
        await loadAdoptants();
        state.currentAdoptant = state.adoptants[state.adoptants.length - 1] || null;
        closeModal('modal-adoptant');
        await refreshPanels();
    } catch (error) {
        console.error(error);
        alert('Erreur réseau');
    }
}

function renderNoAdoptantPanel() {
    const mesDemandesBox = $('mes-demandes-list');
    const monAdoptionBox = $('mon-adoption');
    if (mesDemandesBox) {
        mesDemandesBox.innerHTML = `
            <div>Sélectionnez votre profil pour voir vos demandes.<br/>
                <button id="ouvrir-modal-adoptant">Se connecter / Créer un profil</button>
            </div>
        `;
    }
    if (monAdoptionBox) {
        monAdoptionBox.textContent = 'Aucune adoption en cours.';
    }
    const ouvrirBtn = $('ouvrir-modal-adoptant');
    if (ouvrirBtn) {
        ouvrirBtn.addEventListener('click', async() => {
            await loadAdoptants();
            openModal('modal-adoptant');
        });
    }
}

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
        mesDemandesBox.innerHTML = mes.length === 0 ?
            '<div>Aucune demande envoyée.</div>' :
            mes.map(d => `
                <div class="demande-row">
                    <div>${d.nomAnimal || 'Animal'}</div>
                    <div>${new Date(d.dateDemande).toLocaleDateString()}</div>
                    <div>${d.statut || ''}</div>
                </div>
            `).join('');
    }

    if (monAdoptionBox) {
        const adoptee = mes.find(d => d.statut && d.statut.toLowerCase().includes('accep'));
        monAdoptionBox.innerHTML = adoptee ?
            `<div><strong>${adoptee.nomAnimal}</strong><div>Adopté — ${new Date(adoptee.dateDecision || adoptee.dateDemande).toLocaleDateString()}</div></div>` :
            'Aucune adoption en cours.';
    }
}

function bindActions() {
    $('btn-rechercher') ? .addEventListener('click', applyFiltre);
    $('recherche') ? .addEventListener('keyup', e => { if (e.key === 'Enter') applyFiltre(); });
    $('grille-animaux') ? .addEventListener('click', event => {
        const button = event.target.closest('.button-demande');
        if (!button) return;
        const idAnimal = parseInt(button.dataset.id, 10);
        const animal = state.animaux.find(a => a.idAnimal === idAnimal);
        if (animal) openRequestModal(animal);
    });
    $('fermer-modal') ? .addEventListener('click', () => { resetRequestModal();
        closeModal('modal-demande'); });
    $('annuler-modal') ? .addEventListener('click', () => { resetRequestModal();
        closeModal('modal-demande'); });
    $('fermer-modal-adoptant') ? .addEventListener('click', () => closeModal('modal-adoptant'));
    $('annuler-modal-adoptant') ? .addEventListener('click', () => closeModal('modal-adoptant'));
    $('adoptant-se-connecter') ? .addEventListener('click', async() => {
        const id = parseInt(valueOf('adoptant-select'), 10);
        if (!id) {
            alert('Sélectionnez un adoptant');
            return;
        }
        await setCurrentAdoptant(id);
        closeModal('modal-adoptant');
    });
    $('creer-modal-adoptant') ? .addEventListener('click', createAdoptant);
    $('envoyer-demande') ? .addEventListener('click', envoyerDemande);
}

function init() {
    bindActions();
    loadData().catch(error => console.error(error));
}

document.addEventListener('DOMContentLoaded', init);