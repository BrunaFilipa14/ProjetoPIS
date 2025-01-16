let teamId = null;

function getId(id){
    teamId = id;
}

//? PUT - Edit Team
function editTeam(){
    
    const form = document.getElementById("editModalForm");
    const formData = new FormData(form);

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

//* POST - Create Team
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

//! DELETE - Delete Team
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

//! DELETE - Delete ALL Teams
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

function getTeamPlayers(name){
    const modalBody = document.querySelector('#teamPlayersModal .modal-body tbody');
    modalBody.innerHTML = `<tr><td colspan="6" class="text-center">Loading...</td></tr>`;
        
    fetch(`/api/teams/${name}/players`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch team players.");
        }
        return response.json();
    })
    .then(data => {
        modalBody.innerHTML = "";
        if (data.length > 0) {
            data.forEach(data => {
                const row = `
                    <tr class="align-middle">
                        <td>${data.athlete_name}</td>
                        <td>${data.athlete_birthDate}</td>
                        <td>${data.athlete_height}</td>
                        <td>${data.athlete_weight}</td>
                        <td>${data.athlete_nationality}</td>
                        <td>${data.athlete_position}</td>
                    </tr>
                `;
                modalBody.innerHTML += row;
            });
        } else {
            modalBody.innerHTML = `<tr><td colspan="6" class="text-center">No players found for this team.</td></tr>`;
        }
    })
    .catch(err => console.error(err));
}