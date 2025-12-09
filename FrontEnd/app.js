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
      for (let i = 0; i < json.length; i++) {
        setFigure(json[i]);
        setFigureModal(json[i]);
      };
      const trashDelete = document.querySelectorAll(".trash-container");
        trashDelete.forEach((e) => {
          e.addEventListener("click", (event) => deleteWorks(event, e.id));
        });
    };
  } catch (error) {
    console.error(error.message);
  };
};
//APPELLE DE LA FONCTION
getWorks();

//FUNCTION AJOUT DES TRAVAUX DEPUIS JS DYNAMIQUEMENT
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

//FUNCTION AJOUT DES CATEGORIES FILTRES DEPUIS JS DYNAMIQUEMENT
function setFilter(data) {
  const div = document.createElement("div");
  div.className = data.id;
  div.addEventListener("click", () => getWorks(data.id));
  div.innerHTML = `${data.name}`;
  document.querySelector(".filtres-container").append(div);
};
document.querySelector(".tous").addEventListener("click", () => getWorks()); // AU CLICK DE 'TOUS' APPEL DE GETWORKS()

// FUNCTION EDITIONMODE SI LOGIN AUTORISER
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

// FUNCTION OUVRIR LA MODAL 
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

    document.body.classList.add("no-scroll"); // ON AJOUTE LE HIDDEN SCROLL BAR DU BODY QUAND MODAL OPEN
  });
  ModalAddWorks(); // APELLE DE LA FONCTION
};

// FUNCTION FERMER LA MODAL 
function closeModal() {
  document.getElementById("close").addEventListener("click", function () { // AU CLICK DE 'CROIX' ON RETIRE L'OVERLAY GRIS + MODALE
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".modal").style.display = "none";

    document.body.classList.remove("no-scroll"); // ON RETIRE LE HIDDEN SCROLL BAR DU BODY
  });
  document.querySelector(".overlay").addEventListener("click", function () { // AU CLICK DE 'OVERLAY' ON RETIRE L'OVERLAY GRIS + MODALE
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".modal").style.display = "none";

    document.body.classList.remove("no-scroll"); // ON RETIRE LE HIDDEN SCROLL BAR DU BODY
  });
};
closeModal(); // APPELLE DE LA FONCTION

//FUNCTION AJOUT DES TRAVAUX DEPUIS JS DYNAMIQUEMENT
function setFigureModal(data) {
  figure = document.createElement("figure");
  figure.setAttribute("id", "modal-figure-" + data.id);
  figure.innerHTML = `<img src= ${data.imageUrl} alt= ${data.title}> 
  <div class = "trash-container" id="${data.id}"><i id="trash" class="fa-solid fa-trash-can"></i></div>`; // AJOUT DES IMG 
  figure.className = "modal-figure"; // AJOUT D'UNE CLASSNAME '.'
  document.querySelector(".gallery-modal").append(figure); // APPEND FIGURE DANS '.GALLERY-MODAL' 
};

// FUNCTION OUVRIR LA MODAL ADD WORKS
function ModalAddWorks() {
  document.getElementById("open-add-works").addEventListener("click", function () { // AU CLICK DU 'BTN' AJOUT DE LA MODALADDWORKS
    document.querySelector(".gallery-container").style.display = "none";
    document.getElementById("title-modal").innerHTML = "Ajout photo";
    document.getElementById("open-add-works").value = "Valider";
    document.querySelector(".add-works").style.display = "block";
    document.getElementById("arrow-left").style.display = "block";
    document.getElementById("open-add-works").style.backgroundColor = "#A7A7A7";
  });
};

// FUNCTION SWITCH LES DEUX MODAL
function switchModal() {
  document.getElementById("arrow-left").addEventListener("click", function () { // AU CLICK DE 'ARROW-LEFT' MODAL REAPPARAIT/MODALADDWORKS DISPARAIT
    document.querySelector(".modal").style.display = "block";

    document.getElementById("title-modal").innerHTML = "Galerie photo";
    document.getElementById("open-add-works").value = "Ajouter une photo";
    document.querySelector(".add-works").style.display = "none";
    document.querySelector(".gallery-container").style.display = "block";
    document.getElementById("arrow-left").style.display = "none";
    document.getElementById("open-add-works").style.backgroundColor = "#1D6154";
  });
};
switchModal(); // APPELLE DE LA FONCTION

async function deleteWorks(event, trashId) {
  const id = event.currentTarget.id;
  const token = sessionStorage.authToken;
  const url = "http://localhost:5678/api/works/";

  let response = await fetch(url + id, {
    method: "DELETE",
    headers: {
      "Accept": "*/*",
      "Authorization": "Bearer " + token,
    },
  });

  if (response.status === 401 || response.status === 500) {
    throw new Error(`Response status : ${response.status}`);
  }
  else {
      document.getElementById("figure-" + trashId).remove();
      document.getElementById("modal-figure-" + trashId).remove(); 
  }
}
