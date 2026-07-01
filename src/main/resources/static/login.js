const $ = id => document.getElementById(id);

async function login(event) {
    if (event) event.preventDefault();
    const email = $(`login-email`).value.trim();
    const password = $(`login-password`).value.trim();
    const error = $(`login-error`);
    error.textContent = '';

    if (!email || !password) {
        error.textContent = 'Email et mot de passe sont requis.';
        return;
    }

    try {
        const response = await fetch('/api/adoptants/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, motDePasse: password })
        });

        if (!response.ok) {
            const message = await response.text();
            error.textContent = message || 'Échec de la connexion.';
            return;
        }

        const adoptant = await response.json();
        adoptant.motDePasse = null;
        localStorage.setItem('adoptantSession', JSON.stringify(adoptant));
        window.location.href = 'administration.html';
    } catch (e) {
        console.error(e);
        error.textContent = 'Erreur réseau, réessayez.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = $('login-form');
    if (form) {
        form.addEventListener('submit', login);
    }
    const submitButton = $(`login-submit`);
    if (submitButton) {
        submitButton.addEventListener('click', login);
    }
});