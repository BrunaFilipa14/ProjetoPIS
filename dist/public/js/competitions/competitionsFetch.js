let competitionId = null;

function getId(id){
    competitionId = id;
    console.log(competitionId);
}

//? PUT - Edit Competition
function editCompetition(){
    
    let name = document.getElementById(`inputCompetitionNameEdit`).value;

    fetch(`/api/competitions/${competitionId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                "name": name!="" ? name : null
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log("Success:", data);
        alert("Competition edited successfully!");
    })
    .catch(error => {
        console.error("Error in fetch:", error);
        alert("An error occurred: " + error.message);
    });
    location.reload();
}

//* POST - Create Competition
function createCompetition(){
    
    let name = document.getElementById(`inputCompetitionNameCreate`).value;

    fetch("/api/competitions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                "name": name!="" ? name : null
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log("Success:", data);
        alert("Competition created successfully!");
    })
    .catch(error => {
        console.error("Error in fetch:", error);
        alert("An error occurred: " + error.message);
    });
    location.reload();
}

//! DELETE - Delete Competition
function deleteCompetition(){
    console.log(competitionId);
    fetch(`/api/competitions/${competitionId}`, {
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

//! DELETE - Delete ALL Competitions
function deleteAllCompetitions(){
    console.log(competitionId);
    fetch(`/api/competitions/`, {
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

function showCompetitionGames(competitionId){
    const modalBody = document.querySelector('#competitionGamesModal .modal-body tbody');
    modalBody.innerHTML = `<tr><td colspan="6" class="text-center">Loading...</td></tr>`;
    fetch(`/api/competitions/${competitionId}/games`)
    .then(response =>{
        if(!response.ok){
            throw new Error("Failed to fetch competition games.");
        }
        return response.json();
    })
    .then(data =>{
        modalBody.innerHTML = "";
        if(data.length > 0 ){
            data.forEach(data => {
                const row = `
                    <tr class="align-middle">
                        <td>${data.house_team_name}</td>
                        <td>${data.game_result}</td>
                        <td>${data.visiting_team_name}</td>
                        <td>${data.game_date}</td>
                        <td>${data.game_time}</td>
                    </tr>
                `;
                modalBody.innerHTML += row;
            });
        } else {
            modalBody.innerHTML = `<tr><td colspan="6" class="text-center">No games found for this competition.</td></tr>`;
        }
    })
    .catch(err => console.error(err));
}

