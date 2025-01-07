import * as mysql from "mysql2";
import MYSQLPASSWORD from "./mysqlpassword.js";
const connectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: MYSQLPASSWORD
};
const connection = mysql.createConnection(connectionOptions);
fetchCompetitions().then(() => {
    populateTeams().then(() => {
        connection.end((err) => {
            if (err) {
                console.error("Error closing the connection:", err);
            }
            else {
                console.log("connection closed.");
            }
        });
    });
});
//* COMPETITIONS FETCH
function fetchCompetitions() {
    return new Promise((resolve, reject) => {
        // Competition isn't in the 50 free competitions provided by the API, added manually
        connection.query((`INSERT INTO competitions (competition_id, competition_name) VALUES ('4546','EuroLeague Basketball');`), (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("COMPETITIONS TABLE populated!");
            }
        });
        fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php")
            .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
            .then((data) => {
            let basketballLeagues = data.leagues;
            basketballLeagues = basketballLeagues.filter((league) => league.strSport == "Basketball");
            console.log(basketballLeagues);
            basketballLeagues.forEach((league) => {
                connection.query((`INSERT INTO competitions (competition_id, competition_name) VALUES (${league.idLeague},'${league.strLeague}');`), (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        resolve({});
                        console.log("COMPETITIONS TABLE populated!");
                    }
                });
            });
        })
            .catch((error) => {
            console.error("Unable to fetch data:", error);
            reject();
        });
    });
}
function populateTeams() {
    return new Promise((resolve, reject) => {
        let competitions;
        competitions = [];
        connection.query((`SELECT competition_name FROM competitions;`), (err, rows, result) => {
            if (err) {
                console.log(err);
            }
            else {
                rows.forEach((row) => {
                    competitions.push(row.competition_name);
                });
                console.log("rows: ", rows);
                console.log("TEAMS TABLE data transferred to array");
            }
            console.log(competitions);
            competitions.forEach(competition => {
                fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${competition}`)
                    .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    return res.json();
                })
                    .then((data) => {
                    data.teams.forEach((team) => {
                        connection.query((`INSERT INTO teams (team_name, team_initials, team_badge, team_formedYear, team_stadium, team_country) VALUES ('${team.strTeam}','${team.strTeamShort}','${team.strBadge}',${team.intFormedYear},'${team.strStadium}','${team.strCountry}');`), (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("TEAMS TABLE populated!");
                                resolve({});
                            }
                        });
                    });
                })
                    .catch((error) => {
                    reject();
                    console.error("Unable to fetch data:", error);
                });
            });
        });
    });
}
//TODO: TEAMS FETCH (USE THE COMPETITIONS DATABASE TO GET THE COMPETITIONS NAMES IN THE FETCH URL)
//TODO: ASYNC
