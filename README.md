# 📚 LireMonde — Application de lecture en ligne

Projet réalisé dans le cadre du brief **ReadSphere** — Plateforme de culture numérique.

---

## 🗂️ Structure du projet

```
liremonde/
├── index.html          ← Page d'accueil (catalogue + filtres + recherche)
├── alire.html          ← Page "Ma liste À lire"
├── admin/
│   └── admin.html      ← Tableau de bord administrateur
├── css/
│   ├── style.css       ← Styles globaux (navbar, cartes, modale, footer)
│   ├── alire.css       ← Styles spécifiques page "À lire"
│   └── admin.css       ← Styles spécifiques page admin
├── js/
│   ├── api.js          ← Toutes les requêtes fetch (GET, POST, PUT, PATCH, DELETE)
│   ├── main.js         ← Logique page accueil
│   ├── alire.js        ← Logique page "À lire"
│   └── admin.js        ← Logique tableau de bord admin
└── data/
    └── db.json         ← Base de données JSON (8 livres)
```

---

## 🚀 Lancer le projet

### Étape 1 — Installer JSON Server (une seule fois)
```bash
npm install -g json-server
```

### Étape 2 — Démarrer l'API
Depuis le dossier `liremonde/` :
```bash
json-server --watch data/db.json --port 3000
```
L'API tourne sur → **http://localhost:3000/livres**

### Étape 3 — Ouvrir le site
Ouvrir `index.html` dans le navigateur.
> 💡 Utiliser l'extension **Live Server** sur VS Code pour éviter les problèmes CORS.

---

## 🔗 Routes de l'API

| Méthode | Route              | Description                    |
|---------|--------------------|-------------------------------|
| GET     | /livres            | Récupérer tous les livres      |
| GET     | /livres/:id        | Récupérer un livre par id      |
| POST    | /livres            | Ajouter un nouveau livre       |
| PUT     | /livres/:id        | Modifier un livre complet      |
| PATCH   | /livres/:id        | Modifier un champ (ex: aLire)  |
| DELETE  | /livres/:id        | Supprimer un livre             |

---

## ✅ Fonctionnalités

- [x] Affichage dynamique de tous les livres en grille
- [x] Filtrage par genre (boutons générés automatiquement)
- [x] Recherche en temps réel (titre ou auteur)
- [x] Modale de détails avec toutes les infos
- [x] Ajouter / retirer de la liste "À lire" (PATCH)
- [x] Page "À lire" avec suppression instantanée
- [x] Tableau de bord admin : ajouter, modifier, supprimer
- [x] Mise à jour du DOM sans rechargement de page
- [x] Gestion des erreurs réseau (try/catch)
- [x] Gestion des listes vides
- [x] Interface responsive (mobile + desktop)

---

## 👨‍💻 Technologies utilisées

- **HTML5** — Structure sémantique
- **CSS3** — Variables CSS, Flexbox, Grid, animations
- **JavaScript ES6+** — async/await, fetch, DOM dynamique
- **JSON Server** — API REST simulée

---

## 📌 Auteur

Projet individuel — Brief ReadSphere / LireMonde  
Durée : 5 jours (18/05/2026 → 22/05/2026)