// ============================================
// admin.js — Tableau de bord administrateur
// ============================================

let idEnCoursModification = null;

document.addEventListener("DOMContentLoaded", async () => {
  await chargerTableau();
  ecouterFormulaire();
});

// ─────────────────────────────────────────────
// 1. Charger le tableau
// ─────────────────────────────────────────────
async function chargerTableau() {
  const livres = await getAllLivres();
  const tbody  = document.getElementById("tableau-livres");
  tbody.innerHTML = "";

  if (!livres || livres.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="5" class="message-vide">
         Aucun livre. Vérifiez que JSON Server est démarré.
      </td></tr>`;
    return;
  }

  livres.forEach(livre => tbody.appendChild(creerLigneTableau(livre)));
}

// ─────────────────────────────────────────────
// 2. Créer une ligne du tableau
// ─────────────────────────────────────────────
function creerLigneTableau(livre) {
  const tr = document.createElement("tr");
  tr.id = `ligne-${livre.id}`;

   const fallback = "https://via.placeholder.com/40x55/2c3e50/ffffff?text=📚";

  tr.innerHTML = `
    <td>
      <img src="${livre.couverture }" alt="${livre.titre}"
           class="miniature"
            onerror="this.onerror=null; this.src='${fallback}';" />
    </td>
    <td>${livre.titre}</td>
    <td>${livre.auteur}</td>
    <td><span class="badge-genre">${livre.genre}</span></td>
    <td class="actions-tableau">
      <button class="btn-modifier"  onclick="remplirFormulaire(${livre.id})"> Modifier</button>
      <button class="btn-supprimer" onclick="supprimerLivreAdmin(${livre.id})"> Supprimer</button>
    </td>
  `;

  return tr;
}

// ─────────────────────────────────────────────
// 3. Écouter le formulaire (ajout ou modification)
// ─────────────────────────────────────────────
function ecouterFormulaire() {
  document.getElementById("form-livre").addEventListener("submit", async e => {
    e.preventDefault();

    const livreData = {
      titre:       document.getElementById("input-titre").value.trim(),
      auteur:      document.getElementById("input-auteur").value.trim(),
      genre:       document.getElementById("input-genre").value,
      description: document.getElementById("input-description").value.trim(),
      couverture:  document.getElementById("input-couverture").value.trim(),
      aLire: false,
    };

    if (!livreData.titre || !livreData.auteur || !livreData.genre || !livreData.description) {
      afficherNotification("⚠️ Remplissez tous les champs obligatoires.", "erreur");
      return;
    }

    if (idEnCoursModification) {
      livreData.id = idEnCoursModification;
      const resultat = await modifierLivre(idEnCoursModification, livreData);
      if (resultat) {
        afficherNotification("✅ Livre modifié avec succès !");
        reinitialiserFormulaire();
        await chargerTableau();
      } else {
        afficherNotification("❌ Erreur lors de la modification.", "erreur");
      }
    } else {
      const resultat = await ajouterLivre(livreData);
      if (resultat) {
        afficherNotification("✅ Livre ajouté avec succès !");
        reinitialiserFormulaire();
        await chargerTableau();
      } else {
        afficherNotification("❌ Erreur lors de l'ajout.", "erreur");
      }
    }
  });
}

// ─────────────────────────────────────────────
// 4. Remplir le formulaire pour modifier
// ─────────────────────────────────────────────
async function remplirFormulaire(id) {
  const livre = await getLivreById(id);
  if (!livre) return;

  idEnCoursModification = id;
  document.getElementById("input-titre").value       = livre.titre;
  document.getElementById("input-auteur").value      = livre.auteur;
  document.getElementById("input-genre").value       = livre.genre;
  document.getElementById("input-description").value = livre.description;
  document.getElementById("input-couverture").value  = livre.couverture || "";
  document.getElementById("form-titre").textContent    = " Modifier le livre";
  document.getElementById("btn-soumettre").textContent = " Sauvegarder";
  document.getElementById("section-formulaire").scrollIntoView({ behavior: "smooth" });
}

// ─────────────────────────────────────────────
// 5. Réinitialiser le formulaire
// ─────────────────────────────────────────────
function reinitialiserFormulaire() {
  idEnCoursModification = null;
  document.getElementById("form-livre").reset();
  document.getElementById("form-titre").textContent    = "➕ Ajouter un livre";
  document.getElementById("btn-soumettre").textContent = "Ajouter le livre";
}

// ─────────────────────────────────────────────
// 6. Supprimer un livre
// ─────────────────────────────────────────────
async function supprimerLivreAdmin(id) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) return;

  const succes = await supprimerLivre(id);
  if (succes) {
    document.getElementById(`ligne-${id}`)?.remove();
    afficherNotification(" Livre supprimé !");
  } else {
    afficherNotification(" Erreur lors de la suppression.", "erreur");
  }
}

// ─────────────────────────────────────────────
// 7. Notification toast
// ─────────────────────────────────────────────
function afficherNotification(message, type = "succes") {
  const notif = document.getElementById("notification");
  notif.textContent = message;
  notif.style.backgroundColor = type === "erreur" ? "#e74c3c" : "#27ae60";
  notif.classList.add("visible");
  setTimeout(() => notif.classList.remove("visible"), 3000);
}