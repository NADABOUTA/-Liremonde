// ============================================
// main.js — Logique de la page Accueil
// ============================================

// ─── Variables globales ───────────────────────
let tousLesLivres = [];          // Liste complète depuis l'API
let genreActif = "Tous";         // Filtre genre sélectionné
let recherche = "";              // Texte de recherche

// ─── Chargement initial ────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  await chargerLivres();
  ecouterRecherche();
});

// ─────────────────────────────────────────────
// Charger tous les livres depuis l'API
// ─────────────────────────────────────────────
async function chargerLivres() {
  tousLesLivres = await getAllLivres();

  if (tousLesLivres.length === 0) {
    afficherMessageVide("grille-livres", "Aucun livre disponible.");
    return;
  }

  genererFiltres();
  afficherLivresFiltres();
}

// ─────────────────────────────────────────────
// Générer les boutons de filtre par genre
// ─────────────────────────────────────────────
function genererFiltres() {
  const conteneurFiltres = document.getElementById("filtres-genre");
  conteneurFiltres.innerHTML = "";

  // Extraire les genres uniques
  const genres = ["Tous", ...new Set(tousLesLivres.map((l) => l.genre))];

  genres.forEach((genre) => {
    const btn = document.createElement("button");
    btn.textContent = genre;
    btn.classList.add("btn-filtre");
    if (genre === genreActif) btn.classList.add("actif");

    btn.addEventListener("click", () => {
      genreActif = genre;
      // Mettre à jour le bouton actif visuellement
      document.querySelectorAll(".btn-filtre").forEach((b) => b.classList.remove("actif"));
      btn.classList.add("actif");
      afficherLivresFiltres();
    });

    conteneurFiltres.appendChild(btn);
  });
}

// ─────────────────────────────────────────────
// Filtrer + rechercher + afficher les livres
// ─────────────────────────────────────────────
function afficherLivresFiltres() {
  let livresFiltres = tousLesLivres;

  // Filtre par genre
  if (genreActif !== "Tous") {
    livresFiltres = livresFiltres.filter((l) => l.genre === genreActif);
  }

  // Filtre par recherche (titre ou auteur)
  if (recherche.trim() !== "") {
    const mot = recherche.toLowerCase();
    livresFiltres = livresFiltres.filter(
      (l) =>
        l.titre.toLowerCase().includes(mot) ||
        l.auteur.toLowerCase().includes(mot)
    );
  }

  afficherGrille(livresFiltres);
}

// ─────────────────────────────────────────────
// Afficher la grille de cartes
// ─────────────────────────────────────────────
function afficherGrille(livres) {
  const grille = document.getElementById("grille-livres");
  grille.innerHTML = "";

  if (livres.length === 0) {
    afficherMessageVide("grille-livres", "Aucun livre trouvé.");
    return;
  }

  livres.forEach((livre) => {
    const carte = creerCarteLivre(livre);
    grille.appendChild(carte);
  });
}

// ─────────────────────────────────────────────
// Créer une carte HTML pour un livre
// ─────────────────────────────────────────────
function creerCarteLivre(livre) {
  const carte = document.createElement("div");
  carte.classList.add("carte-livre");
  carte.dataset.id = livre.id;

  carte.innerHTML = `
    <div class="carte-image">
      <img src="${livre.couverture}" alt="Couverture de ${livre.titre}" onerror="this.src='https://via.placeholder.com/200x280?text=Pas+d+image'">
      <span class="badge-genre">${livre.genre}</span>
    </div>
    <div class="carte-info">
      <h3 class="carte-titre">${livre.titre}</h3>
      <p class="carte-auteur">✍️ ${livre.auteur}</p>
      <div class="carte-actions">
        <button class="btn-details" onclick="ouvrirModale(${livre.id})">Voir détails</button>
        <button class="btn-alire ${livre.aLire ? "actif" : ""}" onclick="basculerALire(event, ${livre.id})">
          ${livre.aLire ? "❤️ Retiré" : "🤍 À lire"}
        </button>
      </div>
    </div>
  `;

  return carte;
}

// ─────────────────────────────────────────────
// Barre de recherche en temps réel
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
// Ouvrir la modale avec les détails d'un livre
// ─────────────────────────────────────────────
async function ouvrirModale(id) {
  const livre = await getLivreById(id);
  if (!livre) return;

  // Remplir la modale
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
  btnALire.onclick = async () => {
    await basculerALireDepuisModale(livre.id, livre.aLire);
  };

  // Afficher la modale
  document.getElementById("modale").classList.remove("cachee");
}

// ─────────────────────────────────────────────
// Fermer la modale
// ─────────────────────────────────────────────
function fermerModale() {
  document.getElementById("modale").classList.add("cachee");
}

// Fermer en cliquant en dehors
document.addEventListener("click", (e) => {
  const modale = document.getElementById("modale");
  if (e.target === modale) fermerModale();
});

// ─────────────────────────────────────────────
// Basculer À lire (depuis la carte)
// ─────────────────────────────────────────────
async function basculerALire(event, id) {
  event.stopPropagation(); // Ne pas déclencher la modale

  const livre = tousLesLivres.find((l) => l.id === id);
  if (!livre) return;

  const nouvelleValeur = !livre.aLire;
  const resultat = await toggleALire(id, nouvelleValeur);

  if (resultat) {
    // Mettre à jour localement pour éviter un rechargement
    livre.aLire = nouvelleValeur;
    afficherLivresFiltres();
  }
}

// ─────────────────────────────────────────────
// Basculer À lire depuis la modale
// ─────────────────────────────────────────────
async function basculerALireDepuisModale(id, valeurActuelle) {
  const nouvelleValeur = !valeurActuelle;
  const resultat = await toggleALire(id, nouvelleValeur);

  if (resultat) {
    // Rafraîchir la liste locale
    const livre = tousLesLivres.find((l) => l.id === id);
    if (livre) livre.aLire = nouvelleValeur;

    // Mettre à jour le bouton dans la modale
    const btn = document.getElementById("modale-btn-alire");
    btn.textContent = nouvelleValeur ? "❤️ Retirer de la liste" : "🤍 Ajouter à la liste";
    btn.className = "btn-alire " + (nouvelleValeur ? "actif" : "");
    btn.onclick = async () => basculerALireDepuisModale(id, nouvelleValeur);

    afficherLivresFiltres();
  }
}

// ─────────────────────────────────────────────
// Afficher un message si liste vide
// ─────────────────────────────────────────────
function afficherMessageVide(idConteneur, message) {
  const conteneur = document.getElementById(idConteneur);
  conteneur.innerHTML = `<p class="message-vide">📭 ${message}</p>`;
}