import * as mysql from "mysql2";
import MYSQLPASSWORD from "./mysqlpassword";
const connectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: MYSQLPASSWORD
};
const connection = mysql.createConnection(connectionOptions);
//* COMPETITIONS FETCH
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
        connection.query((`INSERT INTO competitions (competition_name) VALUES ('${league.strName}');`), (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("COMPETITIONS TABLE populated!");
            }
        });
    });
})
    .catch((error) => console.error("Unable to fetch data:", error));
//TODO: TEAMS FETCH (USE THE COMPETITIONS DATABASE TO GET THE COMPETITIONS NAMES IN THE FETCH URL)
fetch("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA")
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
            }
        });
    });
})
    .catch((error) => console.error("Unable to fetch data:", error));
//TODO: TIMEOUT, REPLACE WITH ASYNC (ASK TEACHER FOR HELP)
setTimeout(() => {
    connection.end((err) => {
        if (err) {
            console.error("Error closing the connection:", err);
        }
        else {
            console.log("connection closed.");
        }
    });
}, 2000);
