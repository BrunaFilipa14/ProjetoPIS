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


document.addEventListener("DOMContentLoaded", () => {

    fetch(`/api/favourite/athletes`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const athletes = document.querySelectorAll('button[data-athlete-id]');
        
        athletes.forEach(button => {
            let athleteId = button.getAttribute('data-athlete-id');

            let isFavourite = data.favouriteAthletes.includes(parseInt(athleteId));
            if (isFavourite) {
                button.innerHTML = "❤️";
            } else {
                button.innerHTML = "🩶";
            }
        });
    })
    .catch(error => {
        console.error("Error in fetch:", error);
        alert("An error occurred: " + error.message);
    });
});

function favouriteActionAthlete(athleteId){
    const button = document.getElementById(`athlete-${athleteId}`);

    if(button.innerHTML == "❤️"){
        fetch(`/api/favourite/athlete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: athleteId
            })
        })
        .then(response => {
            response.status === 200 ? console.log("Favourite Athlete removed!") : null;
            const button = document.getElementById(`athlete-${athleteId}`);
            console.log(button);
            button.innerHTML = "🩶";
        })
        .catch(error => console.error("Error:", error));
    }
    else if(button.innerHTML == "🩶"){
        fetch(`/api/favourite/athlete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: athleteId
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Favourite Athlete added!");
            const button = document.getElementById(`athlete-${athleteId}`);
            button.innerHTML = "❤️";
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
}


document.addEventListener("DOMContentLoaded", () => {

    fetch(`/api/favourite/teams`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const teams = document.querySelectorAll('button[data-team-id]');
        
        teams.forEach(button => {
            let teamId = button.getAttribute('data-team-id');

            let isFavourite = data.favouriteTeams.includes(parseInt(teamId));
            if (isFavourite) {
                button.innerHTML = "❤️";
            } else {
                button.innerHTML = "🩶";
            }
        });
    })
    .catch(error => {
        console.error("Error in fetch:", error);
        alert("An error occurred: " + error.message);
    });
});

function favouriteActionTeam(teamId){
    const button = document.getElementById(`team-${teamId}`);

    if(button.innerHTML == "❤️"){
        fetch(`/api/favourite/team`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: teamId
            })
        })
        .then(response => {
            response.status === 200 ? console.log("Favourite Team removed!") : null;
            const button = document.getElementById(`team-${teamId}`);
            console.log(button);
            button.innerHTML = "🩶";
        })
        .catch(error => console.error("Error:", error));
    }
    else if(button.innerHTML == "🩶"){
        fetch(`/api/favourite/team`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: teamId
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Favourite Team added!");
            const button = document.getElementById(`team-${teamId}`);
            button.innerHTML = "❤️";
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
}

