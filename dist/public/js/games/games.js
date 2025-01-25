function orderByDate(){
    window.location.href = "/view/games/date";
}

function orderByCompetition(){
    window.location.href = "/view/games/competition";
}


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