// ============================================
// api.js — Toutes les requêtes vers JSON Server
// URL de base de l'API
// ============================================

const API_URL = "http://localhost:3002/livres";

// ─────────────────────────────────────────────
// GET — Récupérer tous les livres
// ─────────────────────────────────────────────
async function getAllLivres() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erreur lors du chargement des livres");
    const livres = await response.json();
    return livres;
  } catch (error) {
    console.error("getAllLivres:", error.message);
    return [];
  }
}

// ─────────────────────────────────────────────
// GET — Récupérer un livre par son id
// ─────────────────────────────────────────────
async function getLivreById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Livre introuvable");
    const livre = await response.json();
    return livre;
  } catch (error) {
    console.error("getLivreById:", error.message);
    return null;
  }
}

// ─────────────────────────────────────────────
// POST — Ajouter un nouveau livre
// ─────────────────────────────────────────────
async function ajouterLivre(nouveauLivre) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nouveauLivre),
    });
    if (!response.ok) throw new Error("Erreur lors de l'ajout du livre");
    const livre = await response.json();
    return livre;
  } catch (error) {
    console.error("ajouterLivre:", error.message);
    return null;
  }
}

// ─────────────────────────────────────────────
// PUT — Modifier un livre complet
// ─────────────────────────────────────────────
async function modifierLivre(id, livreModifie) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livreModifie),
    });
    if (!response.ok) throw new Error("Erreur lors de la modification");
    const livre = await response.json();
    return livre;
  } catch (error) {
    console.error("modifierLivre:", error.message);
    return null;
  }
}

// ─────────────────────────────────────────────
// DELETE — Supprimer un livre
// ─────────────────────────────────────────────
async function supprimerLivre(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression");
    return true;
  } catch (error) {
    console.error("supprimerLivre:", error.message);
    return false;
  }
}

// ─────────────────────────────────────────────
// PATCH — Ajouter / retirer de la liste À lire
// ─────────────────────────────────────────────
async function toggleALire(id, valeur) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aLire: valeur }),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour À lire");
    const livre = await response.json();
    return livre;
  } catch (error) {
    console.error("toggleALire:", error.message);
    return null;
  }
}