// api.js — Toutes les requêtes vers JSON Server

const API_URL = "http://localhost:3002/livres";

// GET — Tous les livres

async function getAllLivres() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erreur serveur : " + response.status);
    return await response.json();
  } catch (error) {
    console.error("getAllLivres :", error.message);
    return [];
  }
}

// GET — Un livre par id

async function getLivreById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Livre introuvable");
    return await response.json();
  } catch (error) {
    console.error("getLivreById :", error.message);
    return null;
  }
}

// POST — Ajouter un livre

async function ajouterLivre(data) {
  try {
    const nextId = await getNextId();  
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, id: nextId }),
    });
    if (!response.ok) throw new Error("Erreur lors de l'ajout");
    return await response.json();
  } catch (error) {
    console.error("ajouterLivre :", error.message);
    return null;
  }
}

// PUT — Modifier un livre complet

async function modifierLivre(id, data) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erreur lors de la modification");
    return await response.json();
  } catch (error) {
    console.error("modifierLivre :", error.message);
    return null;
  }
}

// DELETE — Supprimer un livre

async function supprimerLivre(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erreur lors de la suppression");
    return true;
  } catch (error) {
    console.error("supprimerLivre :", error.message);
    return false;
  }
}

// PATCH — Basculer aLire (true/false)

async function toggleALire(id, valeur) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aLire: valeur }),
    });
    if (!response.ok) throw new Error("Erreur toggle À lire");
    return await response.json();
  } catch (error) {
    console.error("toggleALire :", error.message);
    return null;
  }
}
// GET — Prochain ID numérique disponible
async function getNextId() {
  const livres = await getAllLivres();
  if (livres.length === 0) return 1;
  const maxId = Math.max(...livres.map(l => parseInt(l.id) || 0));
  return maxId + 1;
}