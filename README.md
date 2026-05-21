# 📚 LireMonde — Application de lecture en ligne

Projet ReadSphere | 18/05/2026 → 22/05/2026

---

## 🗂️ Structure

```
liremonde/
├── index.html              ← Accueil (Hero + Catalogue)
├── alire.html              ← Liste À lire
├── admin/
│   └── admin.html          ← Tableau de bord admin
├── css/
│   ├── style.css           ← Styles globaux
│   ├── hero.css            ← Section Hero
│   ├── alire.css           ← Page À lire
│   └── admin.css           ← Page Admin
├── js/
│   ├── api.js              ← Requêtes fetch (GET/POST/PUT/PATCH/DELETE)
│   ├── main.js             ← Logique accueil
│   ├── alire.js            ← Logique À lire
│   └── admin.js            ← Logique CRUD admin
└── data/
    └── db.json             ← Base de données (8 livres)
```

---

## 🚀 Lancer le projet

```bash
# 1. Installer JSON Server
npm install -g json-server

# 2. Démarrer l'API (dans le dossier liremonde/)
json-server --watch data/db.json --port 3002

# 3. Ouvrir index.html avec Live Server (VS Code)
```

---

## ✅ Fonctionnalités complètes

- Hero section animée avec livres flottants
- Affichage dynamique grille de livres
- Filtres genre auto-générés
- Recherche en temps réel
- Modale détails (Échap / clic fond pour fermer)
- Toggle À lire (PATCH)
- Page À lire avec compteur + animation suppression
- Dashboard Admin CRUD complet
- Notifications toast succès/erreur
- Responsive mobile complet