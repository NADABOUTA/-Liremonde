// ============================================
// alire.js — Page "À lire"
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  await chargerListeALire();
});

// ─────────────────────────────────────────────
// 1. Charger et afficher les livres À lire
// ─────────────────────────────────────────────
async function chargerListeALire() {
  const tousLesLivres = await getAllLivres();
  const liste = tousLesLivres.filter(l => l.aLire === true);
  const conteneur = document.getElementById("liste-alire");
  conteneur.innerHTML = "";

  if (liste.length === 0) {
    afficherEtatVide(" Votre liste de lecture est vide.");
    mettreAJourCompteur(0);
    return;
  }

  liste.forEach(livre => conteneur.appendChild(creerCarteALire(livre)));
  mettreAJourCompteur(liste.length);
}

// ─────────────────────────────────────────────
// 2. Créer une carte horizontale
// ─────────────────────────────────────────────
function creerCarteALire(livre) {
  const carte = document.createElement("div");
  carte.classList.add("carte-alire");
  carte.id = `carte-${livre.id}`;

   const fallback = "https://via.placeholder.com/80x110/2c3e50/ffffff?text=📚";

  carte.innerHTML = `
    <img src="${livre.couverture}" alt="${livre.titre}"
          onerror="this.onerror=null; this.src='${fallback}';"/>
    <div class="info-alire">
      <h3>${livre.titre}</h3>
      <p class="auteur-alire"> ${livre.auteur}</p>
      <span class="badge-genre-alire">${livre.genre}</span>
    </div>
    <button class="btn-supprimer" onclick="retirerDeLaListe(${livre.id})">
       Retirer
    </button>
  `;

  return carte;
}

// ─────────────────────────────────────────────
// 3. Retirer un livre (PATCH aLire = false)
// ─────────────────────────────────────────────
async function retirerDeLaListe(id) {
  const resultat = await toggleALire(id, false);
  if (resultat) {
    const carte = document.getElementById(`carte-${id}`);
    if (carte) {
      carte.classList.add("suppression");
      setTimeout(() => {
        carte.remove();
        verifierListeVide();
      }, 400);
    }
  }
}

// ─────────────────────────────────────────────
// 4. Vérifier si la liste est vide
// ─────────────────────────────────────────────
function verifierListeVide() {
  const cartes = document.querySelectorAll(".carte-alire");
  if (cartes.length === 0) {
    afficherEtatVide(" Votre liste de lecture est vide.");
    mettreAJourCompteur(0);
  } else {
    mettreAJourCompteur(cartes.length);
  }
}

// ─────────────────────────────────────────────
// Utilitaires
// ─────────────────────────────────────────────
function afficherEtatVide(message) {
  document.getElementById("liste-alire").innerHTML = `
    <div class="message-vide">
      <p>${message}</p>
      <a href="index.html" class="btn-retour">← Découvrir des livres</a>
    </div>
  `;
}

function mettreAJourCompteur(nombre) {
  const el = document.getElementById("compteur-alire");
  if (!el) return;
  el.textContent = nombre === 0
    ? "Aucun livre dans votre liste"
    : `${nombre} livre${nombre > 1 ? "s" : ""} dans votre liste`;
}