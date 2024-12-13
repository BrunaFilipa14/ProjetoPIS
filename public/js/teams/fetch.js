//PUT
function editTeam(id){
    let name = document.getElementById(`inputTeamName${id}`).value;
    let initials = document.getElementById(`inputTeamInitials${id}`).value;
    let formedYear = document.getElementById(`inputTeamFormedYear${id}`).value;
    let stadium = document.getElementById(`inputTeamStadium${id}`).value;
    let country = document.getElementById(`inputTeamCountry${id}`).value;

    console.log(name);
    console.log(id);
    fetch(`/api/teams/${id}`, {
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
}