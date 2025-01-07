let teamId = null;

function getId(id){
    teamId = id;
}

//? PUT - EDITAR EQUIPA
function editTeam(){
    
    const form = document.getElementById("editModalForm");
    const formData = new FormData(form); // Automatically includes file input

    console.log("FormData created:", Array.from(formData.entries())); // Log form data for debugging

    console.log(formData);


    fetch(`/api/teams/${teamId}`, {
        method: "PUT",
        body: formData // Send the form data as multipart/form-data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log("Success:", data);
        alert("Team edited successfully!");
        location.reload();
    })
    .catch(error => {
        console.error("Error in fetch:", error);
        alert("An error occurred: " + error.message);
    });

}

//* POST - CRIAR EQUIPA
function createTeam(){
    
    const form = document.getElementById("createModalForm");
    const formData = new FormData(form); // Automatically includes file input


    fetch("/api/teams", {
        method: "POST",
        body: formData // Send the form data as multipart/form-data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log("Success:", data);
        alert("Team created successfully!");
        location.reload();
    })
    .catch(error => {
        console.error("Error in fetch:", error);
        alert("An error occurred: " + error.message);
    });
}

//! DELETE - Apagar Equipa
function deleteTeam(){
    console.log(teamId);
    fetch(`/api/teams/${teamId}`, {
        method: "Delete",
        headers:  {
            "Content-Type": "application/json"
        }
    })
    .then((response) => console.log(response))
    .catch((err) => console.error("Error:", err));

    //refresh page
    location.reload();
}

//! DELETE - Apagar TODAS as equipas
function deleteAllTeams(){
    console.log(teamId);
    fetch(`/api/teams/`, {
        method: "Delete",
        headers:  {
            "Content-Type": "application/json"
        }
    })
    .then((response) => console.log(response))
    .catch((err) => console.error("Error:", err));

    //refresh page
    location.reload();
}

function getTeamPlayers(id){
    fetch(`/api/teams/${id}/players`)
    .then(response => console.log(response))
    .catch(err => console.error(err));
}