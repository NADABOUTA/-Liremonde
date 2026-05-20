// ============================================
// main.js — Page Accueil (modale + À lire)
// ============================================

// Variables globales
let tousLesLivres = [];
let genreActif = "Tous";
let recherche = "";

// Lancement au chargement
document.addEventListener("DOMContentLoaded", async () => {
  await chargerLivres();
  ecouterRecherche();
});

// ─────────────────────────────────────────────
// 1. Charger les livres depuis l'API
// ─────────────────────────────────────────────
async function chargerLivres() {
  tousLesLivres = await getAllLivres();

  if (tousLesLivres.length === 0) {
    document.getElementById("grille-livres").innerHTML =
      `<p class="message-vide">📭 Aucun livre disponible.</p>`;
    return;
  }

  genererFiltres();
  afficherLivresFiltres();
}

// ─────────────────────────────────────────────
// 2. Générer les boutons filtres par genre
// ─────────────────────────────────────────────
function genererFiltres() {
  const conteneur = document.getElementById("filtres-genre");
  conteneur.innerHTML = "";

  const genres = ["Tous", ...new Set(tousLesLivres.map(l => l.genre))];

  genres.forEach(genre => {
    const btn = document.createElement("button");
    btn.textContent = genre;
    btn.classList.add("btn-filtre");
    if (genre === genreActif) btn.classList.add("actif");

    btn.addEventListener("click", () => {
      genreActif = genre;
      document.querySelectorAll(".btn-filtre").forEach(b => b.classList.remove("actif"));
      btn.classList.add("actif");
      afficherLivresFiltres();
    });

    conteneur.appendChild(btn);
  });
}

// ─────────────────────────────────────────────
// 3. Filtrer + rechercher + afficher
// ─────────────────────────────────────────────
function afficherLivresFiltres() {
  let livresFiltres = tousLesLivres;

  if (genreActif !== "Tous") {
    livresFiltres = livresFiltres.filter(l => l.genre === genreActif);
  }

  if (recherche.trim() !== "") {
    const mot = recherche.toLowerCase();
    livresFiltres = livresFiltres.filter(
      l => l.titre.toLowerCase().includes(mot) ||
           l.auteur.toLowerCase().includes(mot)
    );
  }

  afficherGrille(livresFiltres);
}

// ─────────────────────────────────────────────
// 4. Afficher la grille de cartes
// ─────────────────────────────────────────────
function afficherGrille(livres) {
  const grille = document.getElementById("grille-livres");
  grille.innerHTML = "";

  if (livres.length === 0) {
    grille.innerHTML = `<p class="message-vide">🔍 Aucun livre trouvé.</p>`;
    return;
  }

  livres.forEach(livre => {
    const carte = creerCarteLivre(livre);
    grille.appendChild(carte);
  });
}

// ─────────────────────────────────────────────
// 5. Créer une carte livre avec boutons
// ─────────────────────────────────────────────
function creerCarteLivre(livre) {
  const carte = document.createElement("div");
  carte.classList.add("carte-livre");

  carte.innerHTML = `
    <div class="carte-image">
      <img
        src="${livre.couverture}"
        alt="${livre.titre}"
        onerror="this.src='https://via.placeholder.com/200x280?text=?'"
      />
      <span class="badge-genre">${livre.genre}</span>
    </div>
    <div class="carte-info">
      <h3 class="carte-titre">${livre.titre}</h3>
      <p class="carte-auteur">✍️ ${livre.auteur}</p>
      <div class="carte-actions">
        <button class="btn-details" onclick="ouvrirModale(${livre.id})">
          🔍 Détails
        </button>
        <button
          class="btn-alire ${livre.aLire ? "actif" : ""}"
          onclick="basculerALire(event, ${livre.id})"
        >
          ${livre.aLire ? "❤️ Retiré" : "🤍 À lire"}
        </button>
      </div>
    </div>
  `;

  return carte;
}

// ─────────────────────────────────────────────
// 6. Recherche en temps réel
// ─────────────────────────────────────────────
function ecouterRecherche() {
  const input = document.getElementById("barre-recherche");
  if (!input) return;

  input.addEventListener("input", (e) => {
    recherche = e.target.value;
    afficherLivresFiltres();
  });
}

// ─────────────────────────────────────────────
// 7. Ouvrir la modale avec les détails
// ─────────────────────────────────────────────
async function ouvrirModale(id) {
  const livre = await getLivreById(id);
  if (!livre) return;

  // Remplir les éléments de la modale
  document.getElementById("modale-image").src = livre.couverture;
  document.getElementById("modale-image").alt = livre.titre;
  document.getElementById("modale-titre").textContent = livre.titre;
  document.getElementById("modale-auteur").textContent = "✍️ " + livre.auteur;
  document.getElementById("modale-genre").textContent = "📚 " + livre.genre;
  document.getElementById("modale-description").textContent = livre.description;

  // Bouton À lire dans la modale
  const btnALire = document.getElementById("modale-btn-alire");
  btnALire.textContent = livre.aLire ? "❤️ Retirer de la liste" : "🤍 Ajouter à la liste";
  btnALire.className = "btn-alire " + (livre.aLire ? "actif" : "");

  // Au clic sur le bouton de la modale
  btnALire.onclick = async () => {
    const nouvelleValeur = !livre.aLire;
    const resultat = await toggleALire(livre.id, nouvelleValeur);

    if (resultat) {
      // Mettre à jour localement
      livre.aLire = nouvelleValeur;
      const livreLocal = tousLesLivres.find(l => l.id === livre.id);
      if (livreLocal) livreLocal.aLire = nouvelleValeur;

      // Mettre à jour le bouton dans la modale
      btnALire.textContent = nouvelleValeur ? "❤️ Retirer de la liste" : "🤍 Ajouter à la liste";
      btnALire.className = "btn-alire " + (nouvelleValeur ? "actif" : "");

      // Rafraîchir la grille
      afficherLivresFiltres();
    }
  };

  // Afficher la modale
  document.getElementById("modale").classList.remove("cachee");
}

// ─────────────────────────────────────────────
// 8. Fermer la modale
// ─────────────────────────────────────────────
function fermerModale() {
  document.getElementById("modale").classList.add("cachee");
}

// Fermer en cliquant sur le fond noir
document.addEventListener("click", (e) => {
  const modale = document.getElementById("modale");
  if (e.target === modale) fermerModale();
});

// ─────────────────────────────────────────────
// 9. Toggle À lire depuis la carte
// ─────────────────────────────────────────────
async function basculerALire(event, id) {
  event.stopPropagation(); // Éviter d'ouvrir la modale

  const livre = tousLesLivres.find(l => l.id === id);
  if (!livre) return;

  const nouvelleValeur = !livre.aLire;
  const resultat = await toggleALire(id, nouvelleValeur);

  if (resultat) {
    livre.aLire = nouvelleValeur;
    afficherLivresFiltres(); // Rafraîchir sans rechargement
  }
}