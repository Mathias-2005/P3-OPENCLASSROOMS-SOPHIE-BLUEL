//METHOD FETCH POUR APPELLER L'API TRAVAUX
async function getWorks(filter) {
  document.querySelector(".gallery").innerHTML = "";
  document.querySelector(".gallery-modal").innerHTML = "";
  const url = "http://localhost:5678/api/works"; // CREATION DE VARIABLE POUR URL DE l'API
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    };
    const json = await response.json();
    if (filter) {
      const filtered = json.filter((data) => data.categoryId === filter);
      for (let i = 0; i < filtered.length; i++) {
        setFigure(filtered[i]);
      };
    }
    else {
      for (let i = 0; i < json.length; i++) { // BOUCLE POUR APPRAITRE LES WORKS 
        setFigure(json[i]);
        setFigureModal(json[i]);
      };
      const trashDelete = document.querySelectorAll(".trash-container"); // AU CLICK DE TRASHDELETE ON APPELE LA FUNCTION DELETE 
      trashDelete.forEach((e) => {
        e.addEventListener("click", (event) => deleteWorks(event, e.id));
      });
    };
  } catch (error) {
    console.error(error.message);
  };
};
// APPELLE DE LA FONCTION
getWorks();

// FONCTION AJOUT DES TRAVAUX DEPUIS JS DYNAMIQUEMENT
function setFigure(data) {
  const figure = document.createElement("figure"); // CREATION DE VARIABLE 'FIGURE'
  figure.setAttribute("id", "figure-" + data.id);
  figure.innerHTML = `<img src= ${data.imageUrl} alt= ${data.title}> 
                        <figcaption>${data.title}</figcaption>`; // AJOUT DES IMG + TITLE 
  document.querySelector(".gallery").append(figure); // APPEND FIGURE DANS '.GALLERY' 
};

//METHOD FETCH POUR APPELLER L'API CATEGORIES
async function getCategories() {
  const url = "http://localhost:5678/api/categories"; // CREATION DE VARIABLE POUR URL DE l'API
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    };

    const json = await response.json();
    console.log(json);

    for (let i = 0; i < json.length; i++) {
      setFilter(json[i]);
    };

  } catch (error) {
    console.error(error.message);
  };
};
// APPELLE DE LA FONCTION
getCategories();

// FONCTION AJOUT DES CATEGORIES FILTRES DEPUIS JS DYNAMIQUEMENT
function setFilter(data) {
  const div = document.createElement("div");
  div.className = data.id;
  div.addEventListener("click", () => getWorks(data.id));
  div.innerHTML = `${data.name}`;
  document.querySelector(".filtres-container").append(div);
};
document.querySelector(".tous").addEventListener("click", () => getWorks()); // AU CLICK DE 'TOUS' APPEL DE GETWORKS()

// FONCTION EDITIONMODE SI LOGIN AUTORISER
function editMode() {
  if (sessionStorage.authToken) {

    const editBanner = document.createElement("div"); // CREATION DE LA DIV EDIT BANNER 
    editBanner.className = "edit"; // AJOUT DU CLASS NAME
    editBanner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i><p>Mode édition</p>'; // AJOUT DANS LA DIV DES ELEMENTS
    document.querySelector("body").prepend(editBanner); // AJOUT DE LA DIV DANS LE BODY AVANT
    document.getElementById("log").innerText = "logout"; // 'LOGOUT' AU LIEU DE 'LOGIN'
    document.getElementById("log").addEventListener("click", function () { // AU CLICK ON RELOAD LA PAGE SANS LA CONNEXION VIA LE SESSIONSTORAGE
      sessionStorage.clear();
      window.location.reload();
    });

    document.querySelector(".filtres-container").style.display = "none" // ON FAIT DISPARAITRE LES FILTRES
    const editProjet = document.createElement("p"); // CREATION DE LA BALISE P 
    editProjet.className = "open-modal";
    editProjet.innerHTML = '<p id="edit-projet"><i class="fa-regular fa-pen-to-square"></i><p><a href="#">modifier</a></p></p>'; // AJOUT DES ELEMENTS
    document.querySelector(".edit-projets").append(editProjet); // AJOUT DE P DANS APRES .EDIT-PROJETS
    openModal(); // APPELLE DE LA FONCTION SI EDIT MODE ACTIF
  };
};
editMode(); // APPELLE DE LA FONCTION

// FONCTION OUVRIR LA MODAL 
function openModal() {
  document.querySelector(".open-modal").addEventListener("click", function () { // AU CLICK DE 'MODIFIER' ON AFFICHE L'OVERLAY GRIS + MODALE
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".modal").style.display = "block";
    document.querySelector(".add-works").style.display = "none";
    document.getElementById("title-modal").innerHTML = "Galerie photo";
    document.getElementById("open-add-works").value = "Ajouter une photo";
    document.querySelector(".gallery-container").style.display = "block";
    document.getElementById("arrow-left").style.display = "none";
    document.getElementById("open-add-works").style.backgroundColor = "#1D6154";
    document.getElementById("open-add-works").disabled = false;

    document.body.classList.add("no-scroll"); // ON AJOUTE LE HIDDEN SCROLL BAR DU BODY QUAND MODAL OPEN
  });
  ModalAddWorks(); // APELLE DE LA FONCTION
};

// FONCTION FERMER LA MODAL 
function closeModal() {
  document.getElementById("close").addEventListener("click", function () { // AU CLICK DE 'CROIX' ON RETIRE L'OVERLAY GRIS + MODALE
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".modal").style.display = "none";
    document.getElementById("output").style.display = "none";

    document.getElementById("picture-svg").style.display = "block";
    document.querySelector(".upload-btn").style.display = "block";
    document.querySelector(".file-info").style.display = "block";
    document.body.classList.remove("no-scroll"); // ON RETIRE LE HIDDEN SCROLL BAR DU BODY
  });
  document.querySelector(".overlay").addEventListener("click", function () { // AU CLICK DE 'OVERLAY' ON RETIRE L'OVERLAY GRIS + MODALE
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".modal").style.display = "none";
    document.getElementById("output").style.display = "none";

    document.getElementById("picture-svg").style.display = "block";
    document.querySelector(".upload-btn").style.display = "block";
    document.querySelector(".file-info").style.display = "block";
    document.body.classList.remove("no-scroll"); // ON RETIRE LE HIDDEN SCROLL BAR DU BODY
  });
};
closeModal(); // APPELLE DE LA FONCTION

// FONCTION AJOUT DES TRAVAUX DEPUIS JS DYNAMIQUEMENT
function setFigureModal(data) {
  figure = document.createElement("figure");
  figure.setAttribute("id", "modal-figure-" + data.id);
  figure.innerHTML = `<img src= ${data.imageUrl} alt= ${data.title}> 
  <div class = "trash-container" id="${data.id}"><i id="trash" class="fa-solid fa-trash-can"></i></div>`; // AJOUT DES IMG 
  figure.className = "modal-figure"; // AJOUT D'UNE CLASSNAME '.'
  document.querySelector(".gallery-modal").append(figure); // APPEND FIGURE DANS '.GALLERY-MODAL' 
};

// FONCTION OUVRIR LA MODAL ADD WORKS
function ModalAddWorks() {
  document.getElementById("open-add-works").addEventListener("click", function () { // AU CLICK DU 'BTN' AJOUT DE LA MODALADDWORKS
    document.querySelector(".gallery-container").style.display = "none";
    document.getElementById("title-modal").innerHTML = "Ajout photo";
    document.getElementById("open-add-works").value = "Valider";
    document.querySelector(".add-works").style.display = "block";
    document.getElementById("arrow-left").style.display = "block";
    document.getElementById("open-add-works").style.backgroundColor = "#A7A7A7";
    document.getElementById("open-add-works").disabled = true;

  });
};

// FONCTION SWITCH LES DEUX MODAL
function switchModal() {
  document.getElementById("arrow-left").addEventListener("click", function () { // AU CLICK DE 'ARROW-LEFT' MODAL REAPPARAIT/MODALADDWORKS DISPARAIT
    document.querySelector(".modal").style.display = "block";

    document.getElementById("title-modal").innerHTML = "Galerie photo";
    document.getElementById("open-add-works").value = "Ajouter une photo";
    document.querySelector(".add-works").style.display = "none";
    document.querySelector(".gallery-container").style.display = "block";
    document.getElementById("arrow-left").style.display = "none";
    document.getElementById("open-add-works").style.backgroundColor = "#1D6154";
    document.getElementById("output").style.display = "none"

    document.getElementById("picture-svg").style.display = "block";
    document.querySelector(".upload-btn").style.display = "block";
    document.querySelector(".file-info").style.display = "block";
  });
};
switchModal(); // APPELLE DE LA FONCTION

async function deleteWorks(event, trashId) {
  const id = event.currentTarget.id; // ON VIENS PRENDRE L'ID DU WORKS QUE ON VEUT DELETE
  const token = sessionStorage.authToken; // ON VIENS PRENDRE LE TOKEN DEPUIS LE SESSIONSTORAGE AUTHORIZATION TOKEN 
  const url = "http://localhost:5678/api/works/"; // ON VIENS PRENDRE L'URL DE L'API DELETE

  let response = await fetch(url + id, { // FETCH + METHOD DELETE
    method: "DELETE",
    headers: {
      "Accept": "*/*",
      "Authorization": "Bearer " + token,
    },
  });

  if (response.status === 401 || response.status === 500) { // ERREUR SI ERROR 401 OU 500
    throw new Error(`Response status : ${response.status}`);
  }
  else {
    document.getElementById("figure-" + trashId).remove(); // ON REMOVE LES FIGURES SANS AVOIR BESOINS DE REFRESH LA PAGE
    document.getElementById("modal-figure-" + trashId).remove(); // ON REMOVE LES FIGURES SANS AVOIR BESOINS DE REFRESH LA PAGE
  };
};

// FONCTION AJOUT DE L'IMG EN PREVIEW AU CHANGEMENT 
document.getElementById("photo-upload").addEventListener("change", loadFile = function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById("output");
    document.getElementById('output').style.display = "block";
    output.src = reader.result;
    if (document.getElementById("output").style.display = "block") { // SI L'IMAGE APPARAIT ON RETIRE LES CHOSES DERRIERES...
      document.getElementById("picture-svg").style.display = "none";
      document.querySelector(".upload-btn").style.display = "none";
      document.querySelector(".file-info").style.display = "none";
    }
  };
  // VERIFICATION DU TYPE ET DE LA TAILLE DE L'IMAGE
  if (file && (file.type === "image/jpeg" || file.type === "image/png" && file.size <= 4 * 1024 * 1024)) {
    reader.readAsDataURL(file);
  } else {
    alert("Veuilliez sélectionner une images au format JPG ou PNG. Ne dépassant pas 4MO.") // MESSAGE D'ERREUR SI ...
  }
});

// FONCTION AVOIR LES CATEGORIES DANS LA MODAL 
async function loadCategories() {
  const categorySelect = document.getElementById("categorie");
  if (!categorySelect) {
    console.error("L'élément categoryInput n'a pas été trouvé.");
    return;
  }
  categorySelect.innerHTML = ""; // VIDE LES OPTIONS EXISTANTE

  try {
    const response = await fetch("http://localhost:5678/api/categories"); // ON RECUPERE L'URL API CATEGORIES
    const categories = await response.json();

    // AJOUTE UN CHOIX PAR DEFAUT
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Choisissez une catégorie";
    categorySelect.appendChild(defaultOption);

    // AJOUTE LES CATEGORIES
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
  }
}
loadCategories(); // APELLE DE LA FONCTION


