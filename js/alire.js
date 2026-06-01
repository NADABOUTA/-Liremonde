// alire.js — Page "À lire"

// Chargement initial de la page
document.addEventListener("DOMContentLoaded", async () => {
  await chargerListeALire();
});


// Récupère et affiche tous les livres marqués "à lire"
async function chargerListeALire() {
  const conteneur = document.getElementById("liste-alire");

  const tousLesLivres = await getAllLivres();
  const liste = tousLesLivres.filter(l => l.aLire === true);

  // Vider le conteneur avant affichage
  conteneur.innerHTML = "";

  if (liste.length === 0) {
    afficherEtatVide("Votre liste de lecture est vide.");
    return;
  }

  liste.forEach(livre => {
    conteneur.appendChild(creerCarteALire(livre));
  });
}


// Crée la carte HTML d'un livre dans la liste "à lire"
function creerCarteALire(livre) {
  const carte = document.createElement("div");
  carte.classList.add("carte-alire");
  carte.id = `carte-${livre.id}`;

  const fallback = "https://via.placeholder.com/80x110/2c3e50/ffffff?text=📚";

  carte.innerHTML = `
    <img src="${livre.couverture}" alt="${livre.titre}"
         onerror="this.onerror=null; this.src='${fallback}';" />
    
    <div class="info-alire">
      <h3>${livre.titre}</h3>
      <p class="auteur-alire">${livre.auteur}</p>
      <span class="badge-genre-alire">${livre.genre}</span>
    </div>

    <button class="btn-supprimer" onclick="retirerDeLaListe(${livre.id})">
      Retirer
    </button>
  `;

  return carte;
}

// Retire un livre de la liste "à lire" avec animation
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

// Vérifie si la liste est vide
function verifierListeVide() {
  const cartes = document.querySelectorAll(".carte-alire");

  if (cartes.length === 0) {
    afficherEtatVide("Votre liste de lecture est vide.");
  }
}

// Affiche message quand la liste est vide
function afficherEtatVide(message) {
  const conteneur = document.getElementById("liste-alire");

  conteneur.innerHTML = `
    <div class="message-vide">
      <p>${message}</p>
      <a href="index.html" class="btn-retour">← Découvrir des livres</a>
    </div>
  `;
}