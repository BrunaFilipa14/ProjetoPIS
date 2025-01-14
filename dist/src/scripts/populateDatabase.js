import * as mysql from "mysql2";
import MYSQLPASSWORD from "./mysqlpassword.js";
const connectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: MYSQLPASSWORD
};
const connection = mysql.createConnection(connectionOptions);
main();
//* MAIN
async function main() {
    try {
        await populateCompetitions();
        await populateTeams();
    }
    catch (err) {
        console.log("Error Populating: ", err);
    }
    finally {
        connection.end((err) => {
            if (err) {
                console.error("Error closing the connection:", err);
            }
            else {
                console.log("connection closed.");
            }
        });
    }
}
//* POPULATE COMPETITIONS
async function populateCompetitions() {
    await populateQueryCompetitions(4546, 'EuroLeague Basketball');
    try {
        const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php");
        if (!res.ok)
            throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        const basketballLeagues = data.leagues.filter((league) => league.strSport == "Basketball");
        for (const competition of basketballLeagues) {
            await populateQueryCompetitions(competition.idLeague, competition.strLeague);
        }
    }
    catch (error) {
        throw new Error(`Cannot fetch data, error:${error}`);
    }
}
//* POPULATE TEAMS
//! Quando vai popular BC Andorra, dá erro porque o estádio tem ' no nome, por arranjar
async function populateTeams() {
    try {
        const competitions = await getCompetitionNames();
        console.log(competitions);
        for (const competition of competitions) {
            const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${competition}`);
            if (!res.ok)
                throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            if (data.teams) {
                for (const team of data.teams) {
                    await populateQueryTeams(team.strTeam, team.strTeamShort, team.strBadge, team.intFormedYear, team.strStadium, team.strCountry);
                }
            }
        }
    }
    catch (error) {
        throw new Error(`Cannot fetch data, error:${error}`);
    }
}
//* POPULATE QUERIES
function populateQueryCompetitions(competitionId, competitionName) {
    return new Promise((resolve, reject) => {
        connection.query((`INSERT INTO competitions (competition_id, competition_name) VALUES (${competitionId},'${competitionName}');`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`${competitionName} added to table COMPETITIONS!`);
        resolve();
    });
}
function populateQueryTeams(teamName, teamInitials, teamBadge, teamFormedYear, teamStadium, teamCountry) {
    return new Promise((resolve, reject) => {
        connection.query((`INSERT IGNORE INTO teams (team_name, team_initials, team_badge, team_formedYear, team_stadium, team_country) VALUES ('${teamName}','${teamInitials}','${teamBadge}',${teamFormedYear},'${teamStadium}','${teamCountry}');`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`${teamName} added to table TEAMS!`);
        resolve();
    });
}
//* GET DATA FROM DATABASE QUERIES
function getCompetitionNames() {
    return new Promise((resolve, reject) => {
        connection.query((`SELECT competition_name FROM competitions;`), (err, rows, result) => {
            if (err) {
                console.log(err);
                reject();
            }
            else {
                const competitions = rows.map((row) => row.competition_name);
                console.log("rows: ", rows);
                console.log("COMPETITIONS TABLE data transferred to array");
                resolve(competitions);
            }
        });
    });
}
