
let editId = null;

// Load page
document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  handleForm();
});


// READ - table
async function loadBooks() {
  const books = await getAllLivres();
  const tbody = document.getElementById("tableau-livres");

  if (!tbody) return;

  tbody.innerHTML = "";

  (books || []).forEach(book => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        ${book?.couverture 
          ? `<img src="${book.couverture}" class="miniature" 
              alt="${book.titre}" 
              onerror="this.onerror=null; this.src='https://via.placeholder.com/40x55?text=No+Img'"/>` 
          : `<div style="width:40px;height:55px;background:#eee;border-radius:4px;"></div>`
        }
      </td>

      <td>${book?.titre || ""}</td>
      <td>${book?.auteur || ""}</td>
      <td>${book?.genre || ""}</td>

     <td>
  <div class="actions-tableau">
    <button class="btn-modifier" onclick="editBook(${book.id})">Modifier</button>
    <button class="btn-supprimer" onclick="deleteBook(${book.id})">Supprimer</button>
  </div>
</td>
    `;

    tbody.appendChild(tr);
  });
}


// CREATE + UPDATE
function handleForm() {
  const form = document.getElementById("form-livre");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const book = {
      titre: document.getElementById("input-titre")?.value || "",
      auteur: document.getElementById("input-auteur")?.value || "",
      genre: document.getElementById("input-genre")?.value || "",
      description: document.getElementById("input-description")?.value || "",
      couverture: document.getElementById("input-couverture")?.value || ""
    };

    if (!book.titre || !book.auteur || !book.genre) {
      alert("Remplis les champs obligatoires");
      return;
    }

    if (editId) {
      await modifierLivre(editId, book);
      editId = null;
      document.getElementById("btn-submit").textContent = "Ajouter";
    } else {
      await ajouterLivre({ ...book, aLire: false });
    }

    form.reset();
    loadBooks();
  });
}


// EDIT
async function editBook(id) {
  const book = await getLivreById(id);

  if (!book) {
    console.log("Livre introuvable");
    return;
  }

  document.getElementById("input-titre").value = book.titre || "";
  document.getElementById("input-auteur").value = book.auteur || "";
  document.getElementById("input-genre").value = book.genre || "";
  document.getElementById("input-description").value = book.description || "";
  document.getElementById("input-couverture").value = book.couverture || "";

  editId = id;

  const btn = document.getElementById("btn-submit");
  if (btn) btn.textContent = "Modifier";
}


// DELETE
async function deleteBook(id) {
  const confirmDelete = confirm("Supprimer ce livre ?");
  if (!confirmDelete) return;

  await supprimerLivre(id);
  loadBooks();
}