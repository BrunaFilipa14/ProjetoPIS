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
