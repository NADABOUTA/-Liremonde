// ============================================
// api.js — Toutes les requêtes vers JSON Server
// ============================================

const API_URL = "http://localhost:3002/livres";

// ─────────────────────────────────────────────
// GET — Récupérer tous les livres
// ─────────────────────────────────────────────
async function getAllLivres() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erreur chargement livres");
    const livres = await response.json();
    return livres;
  } catch (error) {
    console.error("getAllLivres:", error.message);
    return [];
  }
}

// ─────────────────────────────────────────────
// GET — Récupérer un livre par id
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
// PATCH — Ajouter / retirer de la liste À lire
// ─────────────────────────────────────────────
async function toggleALire(id, valeur) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aLire: valeur }),
    });
    if (!response.ok) throw new Error("Erreur toggle À lire");
    const livre = await response.json();
    return livre;
  } catch (error) {
    console.error("toggleALire:", error.message);
    return null;
  }
}