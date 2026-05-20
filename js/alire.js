// ============================================
// alire.js — Page "À lire"
// ============================================

// Lancement au chargement
document.addEventListener("DOMContentLoaded", async () => {
  await chargerListeALire();
});

// ─────────────────────────────────────────────
// 1. Charger et afficher les livres À lire
// ─────────────────────────────────────────────
async function chargerListeALire() {
  const tousLesLivres = await getAllLivres();

  // Garder uniquement ceux avec aLire = true
  const listeLivres = tousLesLivres.filter(livre => livre.aLire === true);

  const conteneur = document.getElementById("liste-alire");
  conteneur.innerHTML = "";

  // Si la liste est vide
  if (listeLivres.length === 0) {
    conteneur.innerHTML = `
      <div class="message-vide">
        <p>📭 Votre liste de lecture est vide.</p>
        <a href="index.html" class="btn-retour">← Découvrir des livres</a>
      </div>
    `;
    document.getElementById("compteur-alire").textContent = "0 livre dans votre liste";
    return;
  }

  // Afficher chaque livre
  listeLivres.forEach(livre => {
    const carte = creerCarteALire(livre);
    conteneur.appendChild(carte);
  });

  // Afficher le compteur
  document.getElementById("compteur-alire").textContent =
    `${listeLivres.length} livre(s) dans votre liste`;
}

// ─────────────────────────────────────────────
// 2. Créer une carte pour la liste À lire
// ─────────────────────────────────────────────
function creerCarteALire(livre) {
  const carte = document.createElement("div");
  carte.classList.add("carte-alire");
  carte.id = `carte-${livre.id}`;

  carte.innerHTML = `
    <img
      src="${livre.couverture}"
      alt="${livre.titre}"
      onerror="this.src='https://via.placeholder.com/80x110?text=?'"
    />
    <div class="info-alire">
      <h3>${livre.titre}</h3>
      <p class="auteur-alire">✍️ ${livre.auteur}</p>
      <span class="badge-genre">${livre.genre}</span>
    </div>
    <button class="btn-supprimer" onclick="retirerDeLaListe(${livre.id})">
      🗑️ Retirer
    </button>
  `;

  return carte;
}

// ─────────────────────────────────────────────
// 3. Retirer un livre de la liste (PATCH)
// ─────────────────────────────────────────────
async function retirerDeLaListe(id) {
  const resultat = await toggleALire(id, false);

  if (resultat) {
    // Supprimer la carte du DOM avec animation
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
// 4. Vérifier si la liste est vide après suppression
// ─────────────────────────────────────────────
function verifierListeVide() {
  const conteneur = document.getElementById("liste-alire");
  const cartes = conteneur.querySelectorAll(".carte-alire");

  if (cartes.length === 0) {
    conteneur.innerHTML = `
      <div class="message-vide">
        <p>📭 Votre liste de lecture est vide.</p>
        <a href="index.html" class="btn-retour">← Découvrir des livres</a>
      </div>
    `;
    document.getElementById("compteur-alire").textContent = "0 livre dans votre liste";
  } else {
    document.getElementById("compteur-alire").textContent =
      `${cartes.length} livre(s) dans votre liste`;
  }
}