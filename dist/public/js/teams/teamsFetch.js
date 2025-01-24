let teamId = null;

function getId(id){
    teamId = id;
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


// FAVOURITE TEAMS
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

// Search Team
let teamSearchForm = document.getElementById('form_search_team');
let teamSearchInput = document.getElementById('input_search_team');

teamSearchForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const inputValue = teamSearchInput.value;
    if (!inputValue) return;
    
    window.location.href = `/view/teams/${inputValue}`;
});
