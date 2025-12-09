const url = "http://localhost:5678/api/users/login"; // URL DE L'API LOGIN

document.getElementById("loginform").addEventListener("submit", getLogin); // AU SUBMIT DU BOUTON ON LANCE LA FUNCTION GETLOGIN

async function getLogin(event) {
    event.preventDefault();  // SI L'EVENT EST PAS GERER L'ACTION NE DEVRAIT PAS ETRE EXECUTER

    let user = {
        email: document.getElementById("email").value, // ON VIENS RECUPERER LA VALEUR DE EMAIL
        password: document.getElementById("password").value // ON VIENS RECUPERER LA VALEUR DE MDP
    };

    let response = await fetch(url, { // FETCH + METHOD POST
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    if (response.status != 200) {
        const errorBox = document.getElementById("error"); // ON VIENS PRENDRE LA DIV ERROR DU HTML 
        errorBox.style.display = "block"; // ON REMOVE LE DISPLAY NONE DU HTML
        errorBox.innerText = "Erreur dans l’identifiant ou le mot de passe"; // ON LUI IMPLEMENTE LE TEXT 
    } else {
        let result = await response.json();
        const token = result.token; // CREATION VARIABLE TOKEN 
        sessionStorage.setItem("authToken", token); // STOCKAGE DU TOKKEN STORAGE
        window.location.href = "index.html"; // REDIRIGE VERS LA PAGE D'ACCEUIL SI LOGIN AUTORISER
    };
};
