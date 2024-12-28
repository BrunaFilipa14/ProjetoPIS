"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql2");
const mysqlpassword_1 = require("./mysqlpassword");
const connectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: mysqlpassword_1.default
};
let teams;
const connection = mysql.createConnection(connectionOptions);
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
    /*teams = data.teams.map((team: { strTeam: string; strTeamShort: string; strBadge: string; intFormedYear: number; strStadium: string; strCountry: string; }) => ({
        team_name: team.strTeam,
        team_initials: team.strTeamShort,
        team_badge: team.strBadge,
        team_formedYear: team.intFormedYear,
        team_stadium: team.strStadium,
        team_country: team.strCountry
    }));*/
})
    .catch((error) => console.error("Unable to fetch data:", error));
/*setTimeout(() => {
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
    console.log("Stored Data:", teams);
}, 2000);*/ 
