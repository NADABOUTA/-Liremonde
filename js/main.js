// ============================================
// main.js — Page Accueil
// ============================================

let tousLesLivres = [];
let genreActif    = "Tous";
let recherche     = "";

// Lancement au chargement de la page
document.addEventListener("DOMContentLoaded", async () => {
  await chargerLivres();
   ecouterRecherche();
  //  animerCompteurHero();
});

// ─────────────────────────────────────────────
// 1. Charger les livres depuis l'API
// ─────────────────────────────────────────────
async function chargerLivres() {
  tousLesLivres = await getAllLivres();

  if (tousLesLivres.length === 0) {
    document.getElementById("grille-livres").innerHTML =
      `<p class="message-vide"> Aucun livre disponible. Vérifiez que JSON Server est démarré.</p>`;
    return;
  }

  genererFiltres();
  afficherLivresFiltres();
}

// ─────────────────────────────────────────────
// 2. Générer les boutons de filtre par genre
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
    grille.innerHTML = `<p class="message-vide"> Aucun livre trouvé.</p>`;
    return;
  }

  livres.forEach(livre => grille.appendChild(creerCarteLivre(livre)));
}

// ─────────────────────────────────────────────
// 5. Créer une carte livre
// ─────────────────────────────────────────────
function creerCarteLivre(livre) {
  const carte = document.createElement("div");
  carte.classList.add("carte-livre");

  const fallback =
    "https://via.placeholder.com/200x280/2c3e50/ffffff?text=📚";

  carte.innerHTML = `
    <div class="carte-image">
      <img 
        src="${livre.couverture}" 
        alt="${livre.titre}"
         onerror="this.onerror=null; this.src='${fallback}';"
      />
    </div>

    <div class="carte-info">
      <span class="badge-genre">${livre.genre}</span>

      <h3 class="carte-titre">${livre.titre}</h3>

      <p class="carte-auteur">${livre.auteur}</p>

      <div class="carte-actions">
        <button 
          class="btn-details" 
          onclick="ouvrirModale(${livre.id})">
          Détails
        </button>

        <button 
          class="btn-alire ${livre.aLire ? "actif" : ""}"
          onclick="basculerALire(event, ${livre.id})">
          ${livre.aLire ? "Retiré" : "À lire"}
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
  input.addEventListener("input", e => {
    recherche = e.target.value;
    afficherLivresFiltres();
  });
}

// ─────────────────────────────────────────────
// 7. Ouvrir la modale
// ─────────────────────────────────────────────
async function ouvrirModale(id) {
  const livre = await getLivreById(id);
  if (!livre) return;

  document.getElementById("modale-image").src             = livre.couverture || "";
  document.getElementById("modale-image").alt             = livre.titre;
  document.getElementById("modale-titre").textContent     = livre.titre;
  document.getElementById("modale-auteur").textContent    = livre.auteur;
  document.getElementById("modale-genre").textContent     = livre.genre;
  document.getElementById("modale-description").textContent = livre.description;

  const btn = document.getElementById("modale-btn-alire");
  btn.textContent = livre.aLire ? " Retirer de la liste" : " Ajouter à la liste";
  btn.className   = "btn-alire " + (livre.aLire ? "actif" : "");

  btn.onclick = async () => {
    const nouvelleValeur = !livre.aLire;
    const resultat = await toggleALire(livre.id, nouvelleValeur);
    if (resultat) {
      livre.aLire = nouvelleValeur;
      const livreLocal = tousLesLivres.find(l => l.id === livre.id);
      if (livreLocal) livreLocal.aLire = nouvelleValeur;
      btn.textContent = nouvelleValeur ? " Retirer de la liste" : " Ajouter à la liste";
      btn.className   = "btn-alire " + (nouvelleValeur ? "actif" : "");
      afficherLivresFiltres();
    }
  };

  document.getElementById("modale").classList.remove("cachee");
}

// ─────────────────────────────────────────────
// 8. Fermer la modale
// ─────────────────────────────────────────────
function fermerModale() {
  document.getElementById("modale").classList.add("cachee");
}

// Fermer avec clic sur fond ou touche Échap
document.addEventListener("click", e => {
  if (e.target === document.getElementById("modale")) fermerModale();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") fermerModale();
});

// ─────────────────────────────────────────────
// 9. Toggle À lire depuis carte
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// 10. Compteur animé dans le hero
// ─────────────────────────────────────────────
// async function animerCompteurHero() {
//   const el = document.getElementById("stat-livres");
//   if (!el) return;
//   const livres = await getAllLivres();
//   const total  = livres.length;
//   let compteur = 0;
//   const intervalle = setInterval(() => {
//     compteur++;
//     el.textContent = compteur;
//     if (compteur >= total) clearInterval(intervalle);
//   }, 150);
// }