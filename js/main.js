// main.js — Page Accueil

let tousLesLivres = [];
let genreActif    = "Tous";
let recherche     = "";

// Chargement initial de la page
document.addEventListener("DOMContentLoaded", async () => {
  await chargerLivres();
  ecouterRecherche();
});

// Récupère tous les livres et initialise l'affichage
async function chargerLivres() {
  tousLesLivres = await getAllLivres();

  if (tousLesLivres.length === 0) {
    document.getElementById("grille-livres").innerHTML =
      `<p class="message-vide">📭 Aucun livre disponible. Vérifiez que JSON Server est démarré.</p>`;
    return;
  }

  genererFiltres();
  afficherLivresFiltres();
}

// Génère les boutons de filtre par genre à partir des données
function genererFiltres() {
  const conteneur = document.getElementById("filtres-genre");
  conteneur.innerHTML = "";

  const genres = ["Tous", ...new Set(tousLesLivres.map(l => l.genre))];

  genres.forEach(genre => {
    const btn = document.createElement("button");
    btn.textContent = genre;
    btn.classList.add("btn-filtre");
    if (genre === genreActif) btn.classList.add("actif");

    // Au clic, active le filtre choisi et rafraîchit la grille
    btn.addEventListener("click", () => {
      genreActif = genre;
      document.querySelectorAll(".btn-filtre").forEach(b => b.classList.remove("actif"));
      btn.classList.add("actif");
      afficherLivresFiltres();
    });

    conteneur.appendChild(btn);
  });
}

// Filtre les livres par genre et par recherche, puis les affiche
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

  const grille = document.getElementById("grille-livres");
  grille.innerHTML = "";

  if (livresFiltres.length === 0) {
    grille.innerHTML = `<p class="message-vide">Aucun livre trouvé.</p>`;
    return;
  }

  livresFiltres.forEach(livre => grille.appendChild(creerCarteLivre(livre)));
}

// Crée la carte HTML d'un livre pour la grille principale
function creerCarteLivre(livre) {
  const carte = document.createElement("div");
  carte.classList.add("carte-livre");

  const fallback = "https://via.placeholder.com/200x280/2c3e50/ffffff?text=📚";

  carte.innerHTML = `
    <div class="carte-image">
      <img src="${livre.couverture || fallback}" alt="${livre.titre}"
           onerror="this.onerror=null; this.src='${fallback}';" />
      <span class="badge-genre">${livre.genre}</span>
    </div>
    <div class="carte-info">
      <h3 class="carte-titre">${livre.titre}</h3>
      <p class="carte-auteur">${livre.auteur}</p>
      <div class="carte-actions">
        <button class="btn-details" onclick="ouvrirModale(${livre.id})">Détails</button>
        <button class="btn-alire ${livre.aLire ? "actif" : ""}"
                onclick="basculerALire(event, ${livre.id})">
          ${livre.aLire ? "❤️ Retiré" : "🤍 À lire"}
        </button>
      </div>
    </div>
  `;

  return carte;
}

// Écoute la saisie dans la barre de recherche et rafraîchit la grille
function ecouterRecherche() {
  const input = document.getElementById("barre-recherche");
  if (!input) return;
  input.addEventListener("input", e => {
    recherche = e.target.value;
    afficherLivresFiltres();
  });
}

// Ouvre la modale avec les détails du livre sélectionné
async function ouvrirModale(id) {
  const livre = await getLivreById(id);
  if (!livre) return;

  document.getElementById("modale-image").src               = livre.couverture || "";
  document.getElementById("modale-image").alt               = livre.titre;
  document.getElementById("modale-titre").textContent       = livre.titre;
  document.getElementById("modale-auteur").textContent      = livre.auteur;
  document.getElementById("modale-genre").textContent       = livre.genre;
  document.getElementById("modale-description").textContent = livre.description;

  const btn = document.getElementById("modale-btn-alire");
  btn.textContent = livre.aLire ? "❤️ Retirer de la liste" : "🤍 Ajouter à la liste";
  btn.className   = "btn-alire " + (livre.aLire ? "actif" : "");

  // Bascule l'état "à lire" depuis la modale et met à jour l'affichage
  btn.onclick = async () => {
    const nouvelleValeur = !livre.aLire;
    const resultat = await toggleALire(livre.id, nouvelleValeur);
    if (resultat) {
      livre.aLire = nouvelleValeur;
      const livreLocal = tousLesLivres.find(l => l.id === livre.id);
      if (livreLocal) livreLocal.aLire = nouvelleValeur;
      btn.textContent = nouvelleValeur ? "❤️ Retirer de la liste" : "🤍 Ajouter à la liste";
      btn.className   = "btn-alire " + (nouvelleValeur ? "actif" : "");
      afficherLivresFiltres();
    }
  };

  document.getElementById("modale").classList.remove("cachee");
}

// Ferme la modale
function fermerModale() {
  document.getElementById("modale").classList.add("cachee");
}

// Ferme la modale en cliquant en dehors ou avec Échap
document.addEventListener("click", e => {
  if (e.target === document.getElementById("modale")) fermerModale();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") fermerModale();
});

// Bascule l'état "à lire" d'un livre depuis la carte (sans propager le clic)
async function basculerALire(event, id) {
  event.stopPropagation();
  const livre = tousLesLivres.find(l => l.id === id);
  if (!livre) return;
  const resultat = await toggleALire(id, !livre.aLire);
  if (resultat) {
    livre.aLire = !livre.aLire;
    afficherLivresFiltres();
  }
}