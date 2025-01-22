const teamsDiv = document.getElementById("teams");
const athletesDiv = document.getElementById("athletes");

function showTeams(){
    teamsDiv.style.display = "block";
    athletesDiv.style.display = "none";
}

function showAthletes(){
    teamsDiv.style.display = "none";
    athletesDiv.style.display = "block";
}

function showAll(){
    teamsDiv.style.display = "block";
    athletesDiv.style.display = "block";
}
