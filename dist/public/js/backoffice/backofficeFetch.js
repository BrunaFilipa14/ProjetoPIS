// Show different

const teamsDiv = document.getElementById("teams");
const athletesDiv = document.getElementById("athletes");
const gamesDiv = document.getElementById("games");
const competitionsDiv = document.getElementById("competitions");


function showTeams(){
    teamsDiv.style.display = "block";
    athletesDiv.style.display = "none";
    gamesDiv.style.display = "none";
    competitionsDiv.style.display = "none";
}

function showAthletes(){
    teamsDiv.style.display = "none";
    athletesDiv.style.display = "block";
    gamesDiv.style.display = "none";
    competitionsDiv.style.display = "none";
}

function showGames(){
    teamsDiv.style.display = "none";
    athletesDiv.style.display = "none";
    gamesDiv.style.display = "block";
    competitionsDiv.style.display = "none";
}

function showCompetitions(){
    teamsDiv.style.display = "none";
    athletesDiv.style.display = "none";
    gamesDiv.style.display = "none";
    competitionsDiv.style.display = "block";
}

function showAll(){
    teamsDiv.style.display = "block";
    athletesDiv.style.display = "block";
    gamesDiv.style.display = "block";
    competitionsDiv.style.display = "block";
}




// Teams
let teamId = null;

function getTeamId(id){
    teamId = id;
}

//? PUT - Edit Team
function editTeam(){
    
    const form = document.getElementById("editTeamsModalForm");
    const formData = new FormData(form);

    fetch(`/api/teams/${teamId}`, {
        method: "PUT",
        body: formData
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
    
    const form = document.getElementById("createTeamsModalForm");
    const formData = new FormData(form);


    fetch("/api/teams", {
        method: "POST",
        body: formData
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



// Athletes
let athleteId = null;

function getAthleteId(id){
    athleteId = id;
}

//? PUT - Edit Athlete
function editAthlete(){
    
    const name = document.getElementById("inputAthleteNameEdit").value;
    const birthDate = document.getElementById("inputAthleteBirthDateEdit").value;
    const height = document.getElementById("inputAthleteHeightEdit").value;
    const weight = document.getElementById("inputAthleteWeightEdit").value;
    const nationality = document.getElementById("inputAthleteNationalityEdit").value;
    const position = document.getElementById("inputAthletePositionEdit").value;
    const team = document.getElementById("inputAthleteTeamEdit").value;

    fetch(`/api/athletes/${athleteId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name": name,
            "birthDate": birthDate,
            "height" : height,
            "weight" : weight,
            "nationality" : nationality,
            "position" : position,
            "team" : team
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
        alert("Athlete edited successfully!");
        location.reload();
    })
    .catch(error => {
        console.error("Error in fetch:", error);
        alert("An error occurred: " + error.message);
    });

}

//* POST - Create Athlete
function createAthlete(){
    
    const name = document.getElementById("inputAthleteNameCreate").value;
    const birthDate = document.getElementById("inputAthleteBirthDateCreate").value;
    const height = document.getElementById("inputAthleteHeightCreate").value;
    const weight = document.getElementById("inputAthleteWeightCreate").value;
    const nationality = document.getElementById("inputAthleteNationalityCreate").value;
    const position = document.getElementById("inputAthletePositionCreate").value;
    const team = document.getElementById("inputAthleteTeamCreate").value;

    fetch(`/api/athletes/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name": name,
            "birthDate": birthDate,
            "height" : height,
            "weight" : weight,
            "nationality" : nationality,
            "position" : position,
            "team" : team
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
        alert("Athlete created successfully!");
        location.reload();
    })
    .catch(error => {
        console.error("Error in fetch:", error);
        alert("An error occurred: " + error.message);
    });
}

//! DELETE - Delete Athlete
function deleteAthlete(){
    console.log(athleteId);
    fetch(`/api/athletes/${athleteId}`, {
        method: "Delete",
        headers:  {
            "Content-Type": "application/json"
        }
    })
    .then((response) => console.log(response))
    .catch((err) => console.error("Error:", err));

    location.reload();
}

//! DELETE - Delete ALL Athletes
function deleteAllAthletes(){
    console.log(athleteId);
    fetch(`/api/athletes/`, {
        method: "Delete",
        headers:  {
            "Content-Type": "application/json"
        }
    })
    .then((response) => console.log(response))
    .catch((err) => console.error("Error:", err));

    location.reload();
}


// Game Athlete Stats
function showAthleteStats(id){
    const modalBody = document.querySelector('#gamePlayersModal .modal-body tbody');
    modalBody.innerHTML = `<tr><td colspan="11" class="text-center">Loading...</td></tr>`;
        console.log(id);
    fetch(`/api/games/${id}/stats`)
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
                <tr>
                    <td>${data.athlete_name}</td>
                    <td>${data.team_name}</td>
                    <td>${data.statistic_points}</td>
                    <td>${data.statistic_rebounds}</td>
                    <td>${data.statistic_assists}</td>
                    <td>${data.statistic_blocks}</td>
                    <td>${data.statistic_steals}</td>
                    <td>${data.statistic_turnovers}</td>
                    <td>${data.statistic_three_pointers_made}</td>
                    <td>${data.statistic_free_throws_made}</td>
                </tr>`;
                modalBody.innerHTML += row;
            });
        } else {
            modalBody.innerHTML = `<tr><td colspan="11" class="text-center">No stats found for this game.</td></tr>`;
        }
    })
    .catch(err => console.error(err));
}

// Games
let gameId = null;

function getGameId(id){
    gameId = id;
}

//? PUT - Edit Game
function editGame(){
    
    const competition = document.getElementById("inputGameCompetitionEdit").value;
    const season = document.getElementById("inputGameSeasonEdit").value;
    const homeTeam = document.getElementById("inputGameHomeTeamEdit").value;
    const score = document.getElementById("inputGameScoreEdit").value;
    const awayTeam = document.getElementById("inputGameAwayTeamEdit").value;
    const date = document.getElementById("inputGameDateEdit").value;

    fetch(`/api/games/${gameId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "competition": competition,
            "season": season,
            "homeTeam" : homeTeam,
            "score" : score,
            "awayTeam" : awayTeam,
            "date" : date,
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
        alert("Game edited successfully!");
        location.reload();
    })
    .catch(error => {
        console.error("Error in fetch:", error);
        alert("An error occurred: " + error.message);
    });

}

//* POST - Create Athlete
function createAthlete(){
    
    const name = document.getElementById("inputAthleteNameCreate").value;
    const birthDate = document.getElementById("inputAthleteBirthDateCreate").value;
    const height = document.getElementById("inputAthleteHeightCreate").value;
    const weight = document.getElementById("inputAthleteWeightCreate").value;
    const nationality = document.getElementById("inputAthleteNationalityCreate").value;
    const position = document.getElementById("inputAthletePositionCreate").value;
    const team = document.getElementById("inputAthleteTeamCreate").value;

    fetch(`/api/athletes/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name": name,
            "birthDate": birthDate,
            "height" : height,
            "weight" : weight,
            "nationality" : nationality,
            "position" : position,
            "team" : team
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
        alert("Athlete created successfully!");
        location.reload();
    })
    .catch(error => {
        console.error("Error in fetch:", error);
        alert("An error occurred: " + error.message);
    });
}

//! DELETE - Delete Athlete
function deleteAthlete(){
    console.log(athleteId);
    fetch(`/api/athletes/${athleteId}`, {
        method: "Delete",
        headers:  {
            "Content-Type": "application/json"
        }
    })
    .then((response) => console.log(response))
    .catch((err) => console.error("Error:", err));

    location.reload();
}

//! DELETE - Delete ALL Athletes
function deleteAllAthletes(){
    console.log(athleteId);
    fetch(`/api/athletes/`, {
        method: "Delete",
        headers:  {
            "Content-Type": "application/json"
        }
    })
    .then((response) => console.log(response))
    .catch((err) => console.error("Error:", err));

    location.reload();
}


// Competitions
let competitionId = null;

function getCompetitionId(id){
    competitionId = id;
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
    let season = document.getElementById(`inputCompetitionSeasonCreate`).value;~
    console.log("Season:",season);
    fetch("/api/competitions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
                "name": name!="" ? name : null,
                "season": season!="" ? season : null
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

    fetch('api/competitions/${competitionId}/games')
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