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

function afficherMenuActif(page) {
    document.querySelectorAll('.lien-menu').forEach(bouton => {
        if (bouton.dataset.page === page) {
            bouton.classList.add('actif');
        } else {
            bouton.classList.remove('actif');
        }
    });
}

function calculerStatistiques() {
    const totalAnimaux = etat.animaux.length;
    const totalDemandes = etat.demandes.length;
    const totalAdoptants = etat.adoptants.length;
    const totalAdoptions = etat.demandes.filter(d => d.statut === 'acceptée' || d.statut === 'acceptee').length;

    const parType = etat.types.map(type => {
        const quantite = etat.animaux.filter(a => a.idTypeAnimal === type.idTypeAnimal).length;
        return { type: type.nomTypeAnimal, quantite };
    });

    return { totalAnimaux, totalDemandes, totalAdoptants, totalAdoptions, parType };
}

function afficherTableauDeBord() {
    const stats = calculerStatistiques();

    selecteurs.contenu.innerHTML = `
        <div class="titre-page">
            <div>
                <h1>Tableau de bord</h1>
                <p>Bienvenue sur votre espace d'administration</p>
            </div>
            <button class="bouton-action bouton-primaire" onclick="changerPage('animaux')">Créer un animal</button>
        </div>

        <div class="grille-4">
            <article class="cart-accueil">
                <div class="icone" style="background: #bfdbfe; color: #1d4ed8;">🐾</div>
                <div class="titre-card">Animaux</div>
                <div class="valeur">${stats.totalAnimaux}</div>
            </article>
            <article class="cart-accueil">
                <div class="icone" style="background: #dbeafe; color: #2563eb;">📋</div>
                <div class="titre-card">Demandes</div>
                <div class="valeur">${stats.totalDemandes}</div>
            </article>
            <article class="cart-accueil">
                <div class="icone" style="background: #dcfce7; color: #15803d;">👤</div>
                <div class="titre-card">Adoptants</div>
                <div class="valeur">${stats.totalAdoptants}</div>
            </article>
            <article class="cart-accueil">
                <div class="icone" style="background: #fee2e2; color: #991b1b;">❤️</div>
                <div class="titre-card">Adoptions</div>
                <div class="valeur">${stats.totalAdoptions}</div>
            </article>
        </div>

        <div class="grille-4">
            <section class="panneau-bloc" style="grid-column: span 2;">
                <h2>Demandes d'adoption récentes</h2>
                <table class="lignes-tableau">
                    <thead>
                        <tr>
                            <th>Adoptant</th>
                            <th>Animal</th>
                            <th>Statut</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${etat.demandes.slice(-5).reverse().map(demande => `
                            <tr>
                                <td>${demande.nomAdoptant || 'Inconnu'}</td>
                                <td>${demande.nomAnimal || 'Inconnu'}</td>
                                <td><span class="indicateur-bulle ${demande.statut === 'nouvelle' ? 'indicateur-attente' : demande.statut === 'en_cours' ? 'indicateur-attente' : demande.statut === 'acceptée' || demande.statut === 'acceptee' ? 'indicateur-valide' : 'indicateur-refuse'}">${demande.statut}</span></td>
                                <td>${demande.dateDemande ? new Date(demande.dateDemande).toLocaleDateString('fr-FR') : '—'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </section>

            <section class="panneau-bloc">
                <h2>Statistiques</h2>
                <p style="color: var(--texte-secondaire); margin-bottom: 18px;">Volume de demandes et adoptions.</p>
                <div style="display:grid; gap: 18px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Demandes</span>
                        <strong>${stats.totalDemandes}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Adoptions</span>
                        <strong>${stats.totalAdoptions}</strong>
                    </div>
                </div>
            </section>
        </div>

        <div class="bloc-petites-cartes">
            <section class="panneau-bloc">
                <h2>Répartition des animaux</h2>
                <ul style="list-style:none; padding:0; margin:0; display:grid; gap:12px;">
                    ${stats.parType.map(item => `
                        <li style="display:flex; justify-content:space-between; font-weight:600;">
                            <span>${item.type}</span>
                            <span>${item.quantite}</span>
                        </li>
                    `).join('')}
                </ul>
            </section>

            <section class="panneau-bloc">
                <h2>Adoptions par mois</h2>
                <p style="color: var(--texte-secondaire); margin-bottom: 18px;">Graphique simplifié selon le statut acceptée.</p>
                <div style="height: 200px; background: var(--surface-soft); border-radius: 24px; display:grid; place-items:center; color: var(--texte-secondaire);">
                    Graphique en cours d'implémentation
                </div>
            </section>

            <section class="panneau-bloc bloc-activite">
                <h2>Activité récente</h2>
                <ul class="liste-activite">
                    <li class="item-activite">
                        <div class="icone-activite">🐶</div>
                        <div class="texte-activite"><strong>Nouvel animal ajouté : Bella (Chienne)</strong><span>Il y a 2 heures</span></div>
                    </li>
                    <li class="item-activite">
                        <div class="icone-activite">✅</div>
                        <div class="texte-activite"><strong>Demande approuvée pour Max</strong><span>Il y a 5 heures</span></div>
                    </li>
                    <li class="item-activite">
                        <div class="icone-activite">📝</div>
                        <div class="texte-activite"><strong>Nouveau compte adoptant : Antoine D.</strong><span>Il y a 1 jour</span></div>
                    </li>
                </ul>
            </section>
        </div>
    `;
}

function afficherPage(page) {
    if (page === 'deconnexion') {
        localStorage.removeItem('adoptantSession');
        window.location.href = 'login.html';
        return;
    }

    selecteurs.champRecherche.value = '';
    etat.page = page;
    afficherMenuActif(page);

    switch (page) {
        case 'tableauDeBord':
            afficherTableauDeBord();
            break;
        case 'animaux':
            afficherPageAnimaux();
            break;
        case 'demandes':
            afficherPageDemandes();
            break;
        case 'adoptants':
            afficherPageAdoptants();
            break;
        case 'suivi':
            afficherPageSuivi();
            break;
        case 'types':
            afficherPageTypes();
            break;
        default:
            afficherTableauDeBord();
            break;
    }
}

function changerPage(page) {
    afficherPage(page);
}

function afficherPageAnimaux() {
    selecteurs.contenu.innerHTML = `
        <div class="titre-page">
            <div>
                <h1>Animaux</h1>
                <p>Gérez les animaux disponibles et leurs informations.</p>
            </div>
            <button class="bouton-action bouton-primaire" onclick="ouvrirFormulaireAnimal()">Nouvel animal</button>
        </div>
        <section class="panneau-bloc">
            <table class="lignes-tableau">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Âge</th>
                        <th>Sexe</th>
                        <th>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    ${etat.animaux.map(animal => `
                        <tr onclick="modifierAnimal(${animal.idAnimal})" style="cursor:pointer;">
                            <td>${animal.idAnimal}</td>
                            <td>${animal.nom}</td>
                            <td>${animal.nomTypeAnimal || '—'}</td>
                            <td>${animal.age ?? '—'}</td>
                            <td>${animal.sexe || '—'}</td>
                            <td>${animal.statut}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </section>
    `;
}

function afficherPageDemandes() {
    const totalDemandes = etat.demandes.length;

    selecteurs.contenu.innerHTML = `
        <div class="titre-page">
            <div>
                <h1>Demandes d'adoption</h1>
                <p>Consultez toutes les demandes envoyées par les futurs adoptants.</p>
            </div>
            <div style="display:flex; gap: 12px; align-items:center;">
                <span style="color: var(--texte-secondaire);">Total : <strong>${totalDemandes}</strong></span>
            </div>
        </div>
        <section class="panneau-bloc">
            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
                <div style="color: var(--texte-secondaire);">Toutes les demandes sont affichées ici. Cliquez sur une ligne pour mettre à jour ou consulter.</div>
            </div>
            <table class="lignes-tableau">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Adoptant</th>
                        <th>Animal</th>
                        <th>Statut</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${etat.demandes.map(demande => `
                        <tr onclick="afficherDetailDemande(${demande.idDemande})" style="cursor:pointer;">
                            <td>${demande.idDemande}</td>
                            <td>${demande.nomAdoptant || '—'}</td>
                            <td>${demande.nomAnimal || '—'}</td>
                            <td>
                                <span class="indicateur-bulle ${demande.statut === 'nouvelle' ? 'indicateur-attente' : demande.statut === 'en_cours' ? 'indicateur-attente' : demande.statut === 'acceptée' || demande.statut === 'acceptee' ? 'indicateur-valide' : 'indicateur-refuse'}">
                                    ${demande.statut}
                                </span>
                            </td>
                            <td>${demande.dateDemande ? new Date(demande.dateDemande).toLocaleDateString('fr-FR') : '—'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </section>
        <div id="modal-detail-demande" class="modal-overlay hidden"></div>
    `;
}

function afficherDetailDemande(idDemande) {
    const demande = etat.demandes.find(d => d.idDemande === idDemande);
    if (!demande) {
        alert('Demande introuvable.');
        return;
    }

    const statutActuel = demande.statut || 'nouvelle';
    const dateDecisionValeur = demande.dateDecision ? new Date(demande.dateDecision).toISOString().slice(0, 16) : '';
    const modal = document.getElementById('modal-detail-demande');
    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-contenu">
            <div class="modal-entete">
                <div>
                    <h2>Détails demande #${demande.idDemande}</h2>
                    <p style="color: var(--texte-secondaire); margin-top: 8px;">Visualisez, modifiez le statut ou supprimez cette demande.</p>
                </div>
                <button class="bouton-fermer-modal" onclick="fermerDetailDemande()">✕</button>
            </div>
            <div class="form-grille">
                <label>ID de la demande<input type="text" value="${demande.idDemande}" disabled /></label>
                <label>Adoptant<input type="text" value="${demande.nomAdoptant || '—'}" disabled /></label>
                <label>Animal<input type="text" value="${demande.nomAnimal || '—'}" disabled /></label>
                <label>Date de la demande<input type="text" value="${demande.dateDemande ? new Date(demande.dateDemande).toLocaleString('fr-FR') : '—'}" disabled /></label>
                <label>Statut<select id="form-statut-demande">
                    <option value="nouvelle" ${statutActuel === 'nouvelle' ? 'selected' : ''}>nouvelle</option>
                    <option value="en_cours" ${statutActuel === 'en_cours' ? 'selected' : ''}>en_cours</option>
                    <option value="acceptée" ${statutActuel === 'acceptée' ? 'selected' : ''}>acceptée</option>
                    <option value="acceptee" ${statutActuel === 'acceptee' ? 'selected' : ''}>acceptee</option>
                    <option value="refusee" ${statutActuel === 'refusee' ? 'selected' : ''}>refusee</option>
                </select></label>
                <label>Message<textarea id="form-message-demande">${demande.message || ''}</textarea></label>
                <label>Date de décision<input id="form-date-decision" type="datetime-local" value="${dateDecisionValeur}" /></label>
            </div>
            <div class="modal-actions">
                <button class="bouton-action bouton-supprimer" onclick="supprimerDemande(${demande.idDemande})">Supprimer la demande</button>
                <button class="bouton-action bouton-secondaire" onclick="fermerDetailDemande()">Annuler</button>
                <button class="bouton-action bouton-primaire" onclick="enregistrerStatutDemande(${demande.idDemande})">Enregistrer</button>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}

function fermerDetailDemande() {
    const modal = document.getElementById('modal-detail-demande');
    if (modal) {
        modal.classList.add('hidden');
        modal.innerHTML = '';
    }
}

async function supprimerDemande(idDemande) {
    if (!confirm('Confirmez-vous la suppression de cette demande ?')) {
        return;
    }

    try {
        const reponse = await fetch(`/api/demandes/${idDemande}`, {
            method: 'DELETE',
        });
        if (reponse.ok) {
            await chargerDonnees();
            fermerDetailDemande();
            afficherPage('demandes');
        } else {
            const messageErreur = await reponse.text();
            alert(`Erreur : ${messageErreur}`);
        }
    } catch (erreur) {
        alert('Erreur réseau, réessayez plus tard.');
    }
}

async function enregistrerStatutDemande(idDemande) {
    const demande = etat.demandes.find(d => d.idDemande === idDemande);
    if (!demande) {
        alert('Demande introuvable');
        return;
    }

    const statut = document.getElementById('form-statut-demande').value;
    const message = document.getElementById('form-message-demande').value;
    const dateDecisionValeur = document.getElementById('form-date-decision').value;

    const charge = {
        idDemande: demande.idDemande,
        idAnimal: demande.idAnimal,
        idAdoptant: demande.idAdoptant,
        dateDemande: demande.dateDemande ? new Date(demande.dateDemande).toISOString() : null,
        statut,
        message,
        dateDecision: dateDecisionValeur ? new Date(dateDecisionValeur).toISOString() : null
    };

    try {
        const reponse = await fetch(`/api/demandes/${idDemande}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(charge),
        });

        if (reponse.ok) {
            await chargerDonnees();
            afficherPage('demandes');
        } else {
            const messageErreur = await reponse.text();
            alert(`Erreur : ${messageErreur}`);
        }
    } catch (erreur) {
        alert('Erreur réseau, réessayez plus tard.');
    }
}

function afficherPageAdoptants() {
    selecteurs.contenu.innerHTML = `
        <div class="titre-page">
            <div>
                <h1>Adoptants</h1>
                <p>Liste des adoptants enregistrés dans la base.</p>
            </div>
            <button class="bouton-action bouton-primaire" onclick="ouvrirFormulaireAdoptant()">Nouvel adoptant</button>
        </div>
        <section class="panneau-bloc">
            <table class="lignes-tableau">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                    </tr>
                </thead>
                <tbody>
                    ${etat.adoptants.map(adoptant => `
                        <tr>
                            <td>${adoptant.idAdoptant}</td>
                            <td>${adoptant.prenom} ${adoptant.nom}</td>
                            <td>${adoptant.email}</td>
                            <td>${adoptant.telephone || '—'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </section>
    `;
}

function afficherPageSuivi() {
    selecteurs.contenu.innerHTML = `
        <div class="titre-page">
            <div>
                <h1>Suivi post-adoption</h1>
                <p>Suivi des demandes et de l'état des animaux après adoption.</p>
            </div>
            <button class="bouton-action bouton-primaire" onclick="ouvrirFormulaireSuivi()">Nouveau suivi</button>
        </div>
        <section class="panneau-bloc">
            <table class="lignes-tableau">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Demande</th>
                        <th>Date</th>
                        <th>État santé</th>
                    </tr>
                </thead>
                <tbody>
                    ${etat.suivis.map(suivi => `
                        <tr>
                            <td>${suivi.idSuivi}</td>
                            <td>${suivi.idDemande}</td>
                            <td>${suivi.dateSuivi ? new Date(suivi.dateSuivi).toLocaleDateString('fr-FR') : '—'}</td>
                            <td>${suivi.etatSante || '—'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </section>
    `;
}

function afficherPageTypes() {
    selecteurs.contenu.innerHTML = `
        <div class="titre-page">
            <div>
                <h1>Types d'animaux</h1>
                <p>Gérez les catégories d'animaux disponibles.</p>
            </div>
            <button class="bouton-action bouton-primaire" onclick="ouvrirFormulaireType()">Nouveau type</button>
        </div>
        <section class="panneau-bloc">
            <table class="lignes-tableau">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    ${etat.types.map(type => `
                        <tr>
                            <td>${type.idTypeAnimal}</td>
                            <td>${type.nomTypeAnimal}</td>
                            <td>${type.description || '—'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </section>
    `;
}

function ouvrirFormulaireAnimal() {
    selecteurs.contenu.innerHTML = `
        <div class="titre-page">
            <div>
                <h1>Nouvel animal</h1>
                <p>Ajoutez un animal au refuge.</p>
            </div>
        </div>
        <section class="panneau-bloc">
            <div class="form-grille">
                <label>Nom<input id="form-nom" type="text" placeholder="Nom de l'animal" /></label>
                <label>Âge<input id="form-age" type="number" min="0" placeholder="Âge" /></label>
                <label>Sexe<select id="form-sexe"><option value="mâle">mâle</option><option value="femelle">femelle</option></select></label>
                <label>Type<select id="form-type">${etat.types.map(type => `<option value="${type.idTypeAnimal}">${type.nomTypeAnimal}</option>`).join('')}</select></label>
                <label>Importer une image<input id="form-photo-upload" type="file" accept="image/*" /></label>
                <input type="hidden" id="form-photo-url" value="" />
                <label>Description<textarea id="form-description" placeholder="Description de l'animal"></textarea></label>
                <div style="display:flex; gap: 14px; flex-wrap: wrap;">
                    <button class="bouton-action bouton-primaire" onclick="creerAnimal()">Enregistrer</button>
                    <button class="bouton-action bouton-secondaire" onclick="afficherPage('animaux')">Annuler</button>
                </div>
            </div>
        </section>
    `;
}

async function uploadPhoto(fichier) {
    if (!fichier) {
        return null;
    }

    const formData = new FormData();
    formData.append('file', fichier);

    const reponse = await fetch('/api/animaux/upload', {
        method: 'POST',
        body: formData,
    });

    if (!reponse.ok) {
        const message = await reponse.text();
        throw new Error(message || 'Impossible de téléverser l\'image');
    }

    return await reponse.text();
}

async function creerAnimal() {
    let photoUrl = document.getElementById('form-photo-url')?.value || '';
    const fichier = document.getElementById('form-photo-upload')?.files?.[0];
    if (fichier) {
        try {
            photoUrl = await uploadPhoto(fichier);
        } catch (erreur) {
            alert(`Erreur upload : ${erreur.message}`);
            return;
        }
    }

    const charge = {
        nom: document.getElementById('form-nom').value,
        age: parseInt(document.getElementById('form-age').value, 10) || 0,
        sexe: document.getElementById('form-sexe').value,
        description: document.getElementById('form-description').value,
        statut: 'disponible',
        photoUrl,
        idTypeAnimal: parseInt(document.getElementById('form-type').value, 10),
    };

    try {
        const reponse = await fetch('/api/animaux', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(charge),
        });
        if (reponse.ok) {
            await chargerDonnees();
            afficherPage('animaux');
        } else {
            const message = await reponse.text();
            alert(`Erreur : ${message}`);
        }
    } catch (erreur) {
        alert('Erreur réseau, réessayez plus tard.');
    }
}

function modifierAnimal(idAnimal) {
    const animal = etat.animaux.find(a => a.idAnimal === idAnimal);
    if (!animal) return;
    selecteurs.contenu.innerHTML = `
        <div class="titre-page">
            <div>
                <h1>Modifier l'animal</h1>
                <p>Mettre à jour les informations de l'animal.</p>
            </div>
        </div>
        <section class="panneau-bloc">
            <div class="form-grille">
                <label>Nom<input id="form-nom" type="text" value="${animal.nom}" /></label>
                <label>Âge<input id="form-age" type="number" min="0" value="${animal.age}" /></label>
                <label>Sexe<select id="form-sexe"><option value="mâle" ${animal.sexe === 'mâle' ? 'selected' : ''}>mâle</option><option value="femelle" ${animal.sexe === 'femelle' ? 'selected' : ''}>femelle</option></select></label>
                <label>Type<select id="form-type">${etat.types.map(type => `<option value="${type.idTypeAnimal}" ${type.idTypeAnimal === animal.idTypeAnimal ? 'selected' : ''}>${type.nomTypeAnimal}</option>`).join('')}</select></label>
                <label>Image<input id="form-photo-upload" type="file" accept="image/*" /></label>
                <input type="hidden" id="form-photo-url" value="${animal.photoUrl || ''}" />
                <label>Description<textarea id="form-description">${animal.description || ''}</textarea></label>
                <div style="display:flex; gap: 14px; flex-wrap: wrap;">
                    <button class="bouton-action bouton-primaire" onclick="enregistrerAnimal(${animal.idAnimal})">Enregistrer</button>
                    <button class="bouton-action bouton-secondaire" onclick="afficherPage('animaux')">Annuler</button>
                </div>
            </div>
        </section>
    `;
}

async function enregistrerAnimal(idAnimal) {
    let photoUrl = document.getElementById('form-photo-url')?.value || '';
    const fichier = document.getElementById('form-photo-upload')?.files?.[0];
    if (fichier) {
        try {
            photoUrl = await uploadPhoto(fichier);
        } catch (erreur) {
            alert(`Erreur upload : ${erreur.message}`);
            return;
        }
    }

    const charge = {
        nom: document.getElementById('form-nom').value,
        age: parseInt(document.getElementById('form-age').value, 10) || 0,
        sexe: document.getElementById('form-sexe').value,
        description: document.getElementById('form-description').value,
        statut: 'disponible',
        photoUrl,
        idTypeAnimal: parseInt(document.getElementById('form-type').value, 10),
    };

    try {
        const reponse = await fetch(`/api/animaux/${idAnimal}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(charge),
        });
        if (reponse.ok) {
            await chargerDonnees();
            afficherPage('animaux');
        } else {
            const message = await reponse.text();
            alert(`Erreur : ${message}`);
        }
    } catch (erreur) {
        alert('Erreur réseau, réessayez plus tard.');
    }
}

function ouvrirFormulaireAdoptant() {
    selecteurs.contenu.innerHTML = `
        <div class="titre-page">
            <div>
                <h1>Nouveau adoptant</h1>
                <p>Ajoutez un nouvel adoptant.</p>
            </div>
        </div>
        <section class="panneau-bloc">
            <div class="form-grille">
                <label>Nom<input id="form-nom-adoptant" type="text" placeholder="Nom" /></label>
                <label>Prénom<input id="form-prenom" type="text" placeholder="Prénom" /></label>
                <label>Email<input id="form-email" type="email" placeholder="Email" /></label>
                <label>Téléphone<input id="form-telephone" type="text" placeholder="Téléphone" /></label>
                <label>Adresse<input id="form-adresse" type="text" placeholder="Adresse" /></label>
                <label>Profession<input id="form-profession" type="text" placeholder="Profession" /></label>
                <label>Rôle<select id="form-role">
                    <option value="adoptant">Adoptant</option>
                    <option value="admin">Admin</option>
                </select></label>
                <div style="display:flex; gap: 14px; flex-wrap: wrap;">
                    <button class="bouton-action bouton-primaire" onclick="creerAdoptant()">Enregistrer</button>
                    <button class="bouton-action bouton-secondaire" onclick="afficherPage('adoptants')">Annuler</button>
                </div>
            </div>
        </section>
    `;
}

async function creerAdoptant() {
    const charge = {
        nom: document.getElementById('form-nom-adoptant').value,
        prenom: document.getElementById('form-prenom').value,
        email: document.getElementById('form-email').value,
        telephone: document.getElementById('form-telephone').value,
        adresse: document.getElementById('form-adresse').value,
        profession: document.getElementById('form-profession').value,
        role: document.getElementById('form-role').value || 'adoptant',
    };

    try {
        const reponse = await fetch('/api/adoptants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(charge),
        });
        if (reponse.ok) {
            await chargerDonnees();
            afficherPage('adoptants');
        } else {
            const message = await reponse.text();
            alert(`Erreur : ${message}`);
        }
    } catch (erreur) {
        alert('Erreur réseau, réessayez plus tard.');
    }
}

function ouvrirFormulaireSuivi() {
    selecteurs.contenu.innerHTML = `
        <div class="titre-page">
            <div>
                <h1>Nouveau suivi</h1>
                <p>Enregistrez un suivi post-adoption.</p>
            </div>
        </div>
        <section class="panneau-bloc">
            <div class="form-grille">
                <label>ID demande<input id="form-id-demande" type="number" min="1" placeholder="ID de la demande" /></label>
                <label>Date de suivi<input id="form-date-suivi" type="datetime-local" /></label>
                <label>État santé<input id="form-etat-sante" type="text" placeholder="État de santé" /></label>
                <label>Commentaire<textarea id="form-commentaire" placeholder="Commentaire"></textarea></label>
                <label>Action suivante<input id="form-action-suivante" type="text" placeholder="Action suivante" /></label>
                <div style="display:flex; gap: 14px; flex-wrap: wrap;">
                    <button class="bouton-action bouton-primaire" onclick="creerSuivi()">Enregistrer</button>
                    <button class="bouton-action bouton-secondaire" onclick="afficherPage('suivi')">Annuler</button>
                </div>
            </div>
        </section>
    `;
}

async function creerSuivi() {
    const dateSuiviValeur = document.getElementById('form-date-suivi').value;
    const charge = {
        idDemande: parseInt(document.getElementById('form-id-demande').value, 10),
        dateSuivi: dateSuiviValeur ? new Date(dateSuiviValeur).toISOString() : null,
        etatSante: document.getElementById('form-etat-sante').value,
        commentaire: document.getElementById('form-commentaire').value,
        actionSuivante: document.getElementById('form-action-suivante').value,
    };

    try {
        const reponse = await fetch('/api/suivis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(charge),
        });
        if (reponse.ok) {
            await chargerDonnees();
            afficherPage('suivi');
        } else {
            const message = await reponse.text();
            alert(`Erreur : ${message}`);
        }
    } catch (erreur) {
        alert('Erreur réseau, réessayez plus tard.');
    }
}

function ouvrirFormulaireType() {
    selecteurs.contenu.innerHTML = `
        <div class="titre-page">
            <div>
                <h1>Nouveau type</h1>
                <p>Ajoutez une catégorie d'animal.</p>
            </div>
        </div>
        <section class="panneau-bloc">
            <div class="form-grille">
                <label>Nom du type<input id="form-nom-type" type="text" placeholder="Nom du type" /></label>
                <label>Description<textarea id="form-description-type" placeholder="Description"></textarea></label>
                <div style="display:flex; gap: 14px; flex-wrap: wrap;">
                    <button class="bouton-action bouton-primaire" onclick="creerType()">Enregistrer</button>
                    <button class="bouton-action bouton-secondaire" onclick="afficherPage('types')">Annuler</button>
                </div>
            </div>
        </section>
    `;
}

async function creerType() {
    const charge = {
        nomTypeAnimal: document.getElementById('form-nom-type').value,
        description: document.getElementById('form-description-type').value,
    };

    try {
        const reponse = await fetch('/api/types', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(charge),
        });
        if (reponse.ok) {
            await chargerDonnees();
            afficherPage('types');
        } else {
            const message = await reponse.text();
            alert(`Erreur : ${message}`);
        }
    } catch (erreur) {
        alert('Erreur réseau, réessayez plus tard.');
    }
}

function initialiserEvenements() {
    document.querySelectorAll('.lien-menu').forEach(bouton => {
        bouton.addEventListener('click', () => {
            changerPage(bouton.dataset.page);
        });
    });

    if (selecteurs.champRecherche) {
        selecteurs.champRecherche.addEventListener('input', event => {
            etat.recherche = event.target.value.toLowerCase();
        });
    }

    if (selecteurs.boutonMenu) {
        selecteurs.boutonMenu.addEventListener('click', () => {
            document.querySelector('.barre-laterale').classList.toggle('ouverte');
        });
    }
}

function requireAdmin() {
    const raw = localStorage.getItem('adoptantSession');
    if (!raw) {
        window.location.href = 'login.html';
        return false;
    }
    try {
        const session = JSON.parse(raw);
        if (!session || session.role !== 'admin') {
            window.location.href = 'login.html';
            return false;
        }
    } catch (e) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

async function demarrerAdmin() {
    if (!requireAdmin()) return;
    await chargerDonnees();
    initialiserEvenements();
    afficherPage(etat.page);
}

window.changerPage = changerPage;
window.ouvrirFormulaireAnimal = ouvrirFormulaireAnimal;
window.creerAnimal = creerAnimal;
window.modifierAnimal = modifierAnimal;
window.enregistrerAnimal = enregistrerAnimal;
window.ouvrirFormulaireAdoptant = ouvrirFormulaireAdoptant;
window.creerAdoptant = creerAdoptant;
window.ouvrirFormulaireSuivi = ouvrirFormulaireSuivi;
window.creerSuivi = creerSuivi;
window.ouvrirFormulaireType = ouvrirFormulaireType;
window.creerType = creerType;

document.addEventListener('DOMContentLoaded', demarrerAdmin);