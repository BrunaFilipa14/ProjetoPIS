"use strict";
let teams;
fetch("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA")
    .then((res) => {
    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
})
    .then((data) => {
    teams = data.teams.map((team) => ({
        team_name: team.strTeam,
        team_initials: team.strTeamShort,
        team_badge: team.strBadge,
        team_formedYear: team.intFormedYear,
        team_stadium: team.strStadium,
        team_country: team.strCountry
    }));
})
    .catch((error) => console.error("Unable to fetch data:", error));
setTimeout(() => {
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
    console.log("Stored Data:", teams);
}, 2000);
