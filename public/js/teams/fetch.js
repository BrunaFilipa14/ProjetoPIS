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