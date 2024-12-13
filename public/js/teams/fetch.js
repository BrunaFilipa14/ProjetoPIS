let teamId = null;

function getId(id){
    teamId = id;
}

//PUT
function editTeam(){
    let name = document.getElementById(`inputTeamName`).value;
    let initials = document.getElementById(`inputTeamInitials`).value;
    let formedYear = document.getElementById(`inputTeamFormedYear`).value;
    let stadium = document.getElementById(`inputTeamStadium`).value;
    let country = document.getElementById(`inputTeamCountry`).value;

    console.log(name);
    console.log(teamId);
    fetch(`/api/teams/${teamId}`, {
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