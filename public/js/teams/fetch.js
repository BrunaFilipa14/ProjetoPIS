let teamId = null;

function getId(id){
    teamId = id;
}

//? PUT - EDITAR EQUIPA
function editTeam(){
    let name = document.getElementById(`inputTeamNameEdit`).value;
    let initials = document.getElementById(`inputTeamInitialsEdit`).value;
    let formedYear = document.getElementById(`inputTeamFormedYearEdit`).value;
    let stadium = document.getElementById(`inputTeamStadiumEdit`).value;
    let country = document.getElementById(`inputTeamCountryEdit`).value;

    fetch(`/teams/${teamId}`, {
        method: "PUT",
        headers:  {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                "name": name!="" ? name : null,
                "initials": initials!="" ? initials : null,
                "formedYear": formedYear!="" ? formedYear : null,
                "stadium": stadium!="" ? stadium : null,
                "country": country!="" ? country : null
        })
    })
    .then((response) => console.log(response))
    .catch((err) => console.log("Error:", err));

    //refresh page
    location.reload();
}

//* POST - CRIAR EQUIPA
function createTeam(){
    let name = document.getElementById(`inputTeamNameCreate`).value;
    let initials = document.getElementById(`inputTeamInitialsCreate`).value;
    let formedYear = document.getElementById(`inputTeamFormedYearCreate`).value;
    let stadium = document.getElementById(`inputTeamStadiumCreate`).value;
    let country = document.getElementById(`inputTeamCountryCreate`).value;

    console.log(name);
    fetch(`/teams/`, {
        method: "POST",
        headers:  {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                "name": name!="" ? name : null,
                "initials": initials!="" ? initials : null,
                "formedYear": formedYear!="" ? formedYear : null,
                "stadium": stadium!="" ? stadium : null,
                "country": country!="" ? country : null
        })
    })
    .then((response) => console.log(response))
    .catch((err) => console.log("Error:", err));

    //refresh page
    location.reload();
}

//! DELETE - Apagar Equipa
function deleteTeam(){
    console.log(teamId);
    fetch(`/teams/${teamId}`, {
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
    fetch(`/teams/`, {
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


function getTeamPlayers(name) {
    const modalBody = document.querySelector('#teamPlayersModal .modal-body tbody');
    modalBody.innerHTML = `<tr><td colspan="6" class="text-center">Loading...</td></tr>`;

    let modalTitle = document.getElementById("teamName");
    modalTitle.textContent = name;

    fetch(`/teams/${name}/players`)
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
        .catch(err => {
            console.error("Error:", err);
            modalBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load players.</td></tr>`;
        });
}
