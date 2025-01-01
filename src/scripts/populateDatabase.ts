import * as mysql from "mysql2";
import MYSQLPASSWORD from "./mysqlpassword";
const connectionOptions: mysql.ConnectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: MYSQLPASSWORD
}
const connection: mysql.Connection = mysql.createConnection(connectionOptions);

//* COMPETITIONS FETCH
fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php")
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {

        let basketballLeagues: Array<{ strName: String, strSport: String }> = data.leagues;
        basketballLeagues = basketballLeagues.filter((league: { strName: String, strSport: String }) => league.strSport == "Basketball");
        console.log(basketballLeagues);
        basketballLeagues.forEach((league: { strName: String, strSport: String }) => {
            connection.query<mysql.ResultSetHeader>((`INSERT INTO competitions (competition_name) VALUES ('${league.strName}');`), (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("COMPETITIONS TABLE populated!");
                }
            });
        });
    })
    .catch((error) =>
        console.error("Unable to fetch data:", error));

//TODO: TEAMS FETCH (USE THE COMPETITIONS DATABASE TO GET THE COMPETITIONS NAMES IN THE FETCH URL)
fetch("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA")
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
        data.teams.forEach((team: { strTeam: string, strTeamShort: string, strBadge: string, intFormedYear: number, strStadium: string, strCountry: string; }) => {
            connection.query<mysql.ResultSetHeader>((`INSERT INTO teams (team_name, team_initials, team_badge, team_formedYear, team_stadium, team_country) VALUES ('${team.strTeam}','${team.strTeamShort}','${team.strBadge}',${team.intFormedYear},'${team.strStadium}','${team.strCountry}');`), (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("TEAMS TABLE populated!");
                }
            });
        });
    })
    .catch((error) =>
        console.error("Unable to fetch data:", error));

//TODO: TIMEOUT, REPLACE WITH ASYNC (ASK TEACHER FOR HELP)
setTimeout(() => {
    connection.end((err) => {
        if (err) {
            console.error("Error closing the connection:", err);
        } else {
            console.log("connection closed.");
        }
    });
}, 2000);
