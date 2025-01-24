import * as mysql from "mysql2";
import * as fs from "fs/promises";
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
        await populateAthletes();
        await populateGames();
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
    await populateQueryCompetitions('EuroLeague Basketball', '2021/2022');
    await populateQueryCompetitions('EuroLeague Basketball', '2022/2023');
    await populateQueryCompetitions('EuroLeague Basketball', '2023/2024');
    try {
        const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php");
        if (!res.ok)
            throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        const basketballLeagues = data.leagues.filter((league) => league.strSport == "Basketball");
        for (const competition of basketballLeagues) {
            await populateQueryCompetitions(competition.strLeague, '2021/2022');
            await populateQueryCompetitions(competition.strLeague, '2022/2023');
            await populateQueryCompetitions(competition.strLeague, '2023/2024');
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
        const competitions = await getCompetitions();
        console.log(competitions);
        for (const competition of competitions) {
            const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${competition.competitionName}`);
            if (!res.ok)
                throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            if (data.teams) {
                let counter = 0;
                for (const team of data.teams) {
                    await populateQueryTeams(team.strTeam, team.strTeamShort, team.strBadge, team.intFormedYear, team.strStadium, team.strCountry);
                    counter++;
                    await populateQueryCompTeam(competition.competitionId, counter);
                }
            }
        }
    }
    catch (error) {
        throw new Error(`Cannot fetch data, error:${error}`);
    }
}
//* POPULATE ATHLETES
//! Quando vai popular De'Aaron Fox, dá erro porque o nome tem ', por arranjar
async function populateAthletes() {
    const jsonData = await fs.readFile('dist/src/components/athlete/data/players.json', 'utf-8');
    const athletes = JSON.parse(jsonData);
    try {
        for (const teamAthletes of athletes) {
            for (const athlete of teamAthletes.players) {
                await populateQueryAthletes(teamAthletes.team_name, athlete.name, athlete.date_of_birth, athlete.height_cm, athlete.weight_kg, athlete.nationality, athlete.position);
            }
        }
    }
    catch (error) {
        throw new Error(`Cannot populate table, error:${error}`);
    }
}
//* POPULATE GAMES
async function populateGames() {
    await populateQueryGames(1, 2, "87-92", "2021-12-15", 1);
    await populateQueryGames(3, 4, "102-98", "2022-01-20", 1);
    await populateQueryGames(5, 6, "79-85", "2022-03-05", 1);
    await populateQueryGames(7, 8, "110-115", "2022-11-12", 2);
    await populateQueryGames(9, 10, "95-88", "2023-01-18", 2);
    await populateQueryGames(11, 12, "103-97", "2023-04-01", 2);
    await populateQueryGames(13, 14, "89-92", "2023-10-10", 3);
    await populateQueryGames(15, 16, "120-118", "2024-01-15", 3);
    await populateQueryGames(17, 18, "97-100", "2024-03-20", 3);
    await populateQueryGames(55, 56, "98-92", "2021-11-10", 4);
    await populateQueryGames(57, 58, "104-99", "2022-01-25", 4);
    await populateQueryGames(59, 60, "91-87", "2022-03-18", 4);
    await populateQueryGames(61, 62, "113-108", "2022-10-15", 5);
    await populateQueryGames(63, 64, "97-102", "2023-02-05", 5);
    await populateQueryGames(65, 66, "110-104", "2023-04-12", 5);
    await populateQueryGames(67, 68, "89-94", "2023-11-20", 6);
    await populateQueryGames(69, 70, "121-118", "2024-01-28", 6);
    await populateQueryGames(71, 72, "106-103", "2024-03-15", 6);
    await populateQueryGames(145, 146, "101-96", "2021-12-05", 7);
    await populateQueryGames(147, 148, "89-93", "2022-01-12", 7);
    await populateQueryGames(149, 150, "112-108", "2022-03-22", 7);
    await populateQueryGames(151, 152, "97-91", "2022-11-08", 8);
    await populateQueryGames(153, 154, "118-120", "2023-02-14", 8);
    await populateQueryGames(155, 156, "106-101", "2023-04-25", 8);
    await populateQueryGames(157, 158, "109-112", "2023-11-05", 9);
    await populateQueryGames(159, 160, "125-119", "2024-01-18", 9);
    await populateQueryGames(161, 162, "98-95", "2024-03-27", 9);
    await populateQueryGames(238, 239, "102-97", "2021-11-22", 10);
    await populateQueryGames(240, 241, "94-89", "2022-01-30", 10);
    await populateQueryGames(242, 243, "115-110", "2022-03-10", 10);
    await populateQueryGames(244, 245, "108-112", "2022-12-05", 11);
    await populateQueryGames(246, 247, "121-118", "2023-02-22", 11);
    await populateQueryGames(248, 249, "103-99", "2023-04-15", 11);
    await populateQueryGames(250, 251, "96-92", "2023-11-12", 12);
    await populateQueryGames(252, 253, "119-114", "2024-01-25", 12);
    await populateQueryGames(238, 240, "105-100", "2024-03-30", 12);
}
//* POPULATE QUERIES
function populateQueryCompetitions(competitionName, competitionSeason) {
    return new Promise((resolve, reject) => {
        connection.query((`INSERT IGNORE INTO competitions (competition_name, competition_season) VALUES ('${competitionName}','${competitionSeason}');`), (err, result) => {
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
function populateQueryAthletes(team_name, name, date_of_birth, height_cm, weight_kg, nationality, position) {
    return new Promise((resolve, reject) => {
        connection.query((`INSERT IGNORE INTO athletes (athlete_name, athlete_birthDate, athlete_height, athlete_weight, athlete_nationality, athlete_position, athlete_team_name) VALUES ('${name}','${date_of_birth}','${height_cm}',${weight_kg},'${nationality}','${position}','${team_name}');`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`${name} added to table Athletes!`);
        resolve();
    });
}
function populateQueryCompTeam(competition_id, team_id) {
    return new Promise((resolve, reject) => {
        connection.query((`INSERT IGNORE INTO competitions_teams (competition_id, team_id) VALUES (${competition_id},${team_id});`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`Link between team and competition has been made!`);
        resolve();
    });
}
function populateQueryGames(houseTeamId, visitTeamId, result, gameDate, competitionId) {
    return new Promise((resolve, reject) => {
        connection.query((`INSERT IGNORE INTO games (game_house_team_id, game_visiting_team_id, game_result, game_date, game_competition_id) VALUES (${houseTeamId},${visitTeamId},'${result}','${gameDate}',${competitionId});`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`Game has been made!`);
        resolve();
    });
}
//* GET DATA FROM DATABASE QUERIES
function getCompetitions() {
    return new Promise((resolve, reject) => {
        connection.query((`SELECT competition_id, competition_name FROM competitions;`), (err, rows, result) => {
            if (err) {
                console.log(err);
                reject();
            }
            else {
                const competitions = rows.map((row) => ({ competitionId: row.competition_id, competitionName: row.competition_name }));
                console.log("rows: ", rows);
                console.log("COMPETITIONS TABLE data transferred to array");
                resolve(competitions);
            }
        });
    });
}
