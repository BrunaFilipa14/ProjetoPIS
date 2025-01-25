import * as mysql from 'mysql2';
import MYSQLPASSWORD from "../../../scripts/mysqlpassword.js";
import { fileURLToPath } from "url";
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD,
    database: "projeto"
};
const connection = mysql.createConnection(connectionOptions);
connection.connect();
const getAllGamesByDate = (req, res, callback) => {
    connection.query("SELECT c.competition_name, c.competition_season, g.game_id, g.game_time, ht.team_name AS house_team, vt.team_name AS visiting_team,g.game_result,g.game_date FROM games g JOIN teams ht ON g.game_house_team_id = ht.team_id JOIN teams vt ON g.game_visiting_team_id = vt.team_id JOIN competitions c ON g.game_competition_id = c.competition_id ORDER BY g.game_date DESC, g.game_time DESC; ", (err, rows, fields) => {
        if (err)
            console.log(err);
        else {
            rows.forEach(row => {
                row.game_date = row.game_date.toISOString().split('T')[0];
            });
            callback(rows);
        }
    });
};
const getAllGamesByCompetition = (req, res, callback) => {
    connection.query("SELECT c.competition_name, c.competition_season, g.game_id, g.game_time, ht.team_name AS house_team, vt.team_name AS visiting_team,g.game_result,g.game_date FROM games g JOIN teams ht ON g.game_house_team_id = ht.team_id JOIN teams vt ON g.game_visiting_team_id = vt.team_id JOIN competitions c ON g.game_competition_id = c.competition_id ORDER BY c.competition_name,g.game_date DESC, g.game_time DESC; ", (err, rows, fields) => {
        if (err)
            console.log(err);
        else {
            rows.forEach(row => {
                row.game_date = row.game_date.toISOString().split('T')[0];
            });
            callback(rows);
        }
    });
};
const getGameByCompetition = (req, res, callback) => {
    connection.query("SELECT c.competition_name, g.game_id, g.game_time, ht.team_name AS house_team, vt.team_name AS visiting_team, g.game_result, g.game_date FROM games g JOIN teams ht ON g.game_house_team_id = ht.team_id JOIN teams vt ON g.game_visiting_team_id = vt.team_id JOIN competitions c ON g.game_competition_id = c.competition_id WHERE g.game_competition_id = ? ORDER BY g.game_date, g.game_time DESC;", [req.body.competitionId], (err, rows) => {
        if (err) {
            console.error("Error fetching games:", err);
        }
        else {
            rows.forEach(row => {
                row.game_date = row.game_date.toISOString().split("T")[0];
            });
            callback(rows);
        }
    });
};
const createGame = async (req, res) => {
    if (!isValidSeasonFormat(req.body.season)) {
        res.status(400).send("Season is invalid!");
        return;
    }
    const seasonYears = req.body.season.split("/").map(Number);
    if (seasonYears.length !== 2) {
        res.status(400).send("Invalid season format.");
        return;
    }
    const gameDate = new Date(req.body.date);
    const gameYear = gameDate.getFullYear();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!seasonYears.includes(gameYear)) {
        res.status(400).send(`Game year ${gameYear} does not match the season years.`);
        return;
    }
    const isFutureGame = gameDate > today;
    if (!isFutureGame && !isValidScoreFormat(req.body.score)) {
        res.status(400).send("Score is required for past or current games and must be valid!");
        return;
    }
    const queryCompetition = await new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM competitions 
                            WHERE competition_name LIKE ? AND competition_season LIKE ?`, [`%${req.body.competition}%`, `%${req.body.season}%`], (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows || []);
        });
    });
    if (queryCompetition.length <= 0) {
        res.status(400).send("Competition does not exist! \n Create one first!");
        return;
    }
    const queryHomeTeam = await new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM teams 
                            WHERE team_name LIKE ?`, [`%${req.body.homeTeam}%`], (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows || []); // Ensure rows is always an array
        });
    });
    if (queryHomeTeam.length <= 0) {
        res.status(400).send("Home Team does not exist!");
        return;
    }
    const queryAwayTeam = await new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM teams 
                            WHERE team_name LIKE ?`, [`%${req.body.awayTeam}%`], (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows || []); // Ensure rows is always an array
        });
    });
    if (queryAwayTeam.length <= 0) {
        res.status(400).send("Away Team does not exist!");
        return;
    }
    let time;
    if (timeFormat(req.body.time)) {
        time = timeFormat(req.body.time);
    }
    else {
        res.status(400).send("Time is not valid!");
        return;
    }
    connection.query(`INSERT INTO games (game_house_team_id, game_visiting_team_id, game_result, game_date, game_competition_id, game_time) VALUES ("${queryHomeTeam[0].team_id}", "${queryAwayTeam[0].team_id}", "${req.body.score}", "${req.body.date}", "${queryCompetition[0].competition_id}", "${time}");`, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send("GAME created successfully!");
        }
    });
};
const editGame = async (req, res) => {
    let edit = 0;
    console.log(req.body);
    if (req.body.competition != null && req.body.competition != "") {
        const queryCompetition = await new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM competitions 
                                WHERE competition_name LIKE ?`, [`%${req.body.competition}%`], (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows || []);
            });
        });
        if (queryCompetition.length > 0) {
            connection.query(`UPDATE games SET game_competition_id = "${queryCompetition[0].competition_id}" WHERE game_id = ${req.params.id};`);
            console.log("Game COMPETITION updated successfully");
            edit += 1;
        }
        else {
            res.status(400).send("Competition does not exist!");
            return;
        }
    }
    if (req.body.season != null && req.body.season != "") {
        if (isValidSeasonFormat(req.body.season)) {
            const queryCompetitionId = await new Promise((resolve, reject) => {
                connection.query(`SELECT * FROM games 
                            WHERE game_id LIKE ?`, [`%${req.params.id}%`], (err, rows) => {
                    if (err)
                        return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                });
            });
            if (queryCompetitionId.length > 0) {
                connection.query(`UPDATE competitions SET competition_season = "${req.body.season}" WHERE competition_id = ${queryCompetitionId[0].game_competition_id};`);
                console.log("Game SEASON updated successfully");
                edit += 1;
            }
        }
        else {
            res.status(400).send("Season is invalid!");
            return;
        }
    }
    if (req.body.homeTeam != null && req.body.homeTeam != "") {
        const queryHomeTeam = await new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM teams 
                                WHERE team_name LIKE ?`, [`%${req.body.homeTeam}%`], (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows || []); // Ensure rows is always an array
            });
        });
        if (queryHomeTeam.length > 0) {
            connection.query(`UPDATE games SET game_house_team_id = "${queryHomeTeam[0].team_id}" WHERE game_id = ${req.params.id};`);
            console.log("Game HOME TEAM updated successfully");
            edit += 1;
        }
        else {
            res.status(400).send("Team does not exist!");
            return;
        }
    }
    if (req.body.awayTeam != null && req.body.awayTeam != "") {
        const queryAwayTeam = await new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM teams 
                                WHERE team_name LIKE ?`, [`%${req.body.awayTeam}%`], (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows || []); // Ensure rows is always an array
            });
        });
        if (queryAwayTeam.length > 0) {
            connection.query(`UPDATE games SET game_away_team_id = "${queryAwayTeam[0].team_id}" WHERE game_id = ${req.params.id};`);
            console.log("Game AWAY TEAM updated successfully");
            edit += 1;
        }
        else {
            res.status(400).send("Team does not exist!");
            return;
        }
    }
    if (req.body.score != null && req.body.score != "") {
        if (isValidScoreFormat(req.body.score)) {
            connection.query(`UPDATE games SET game_result = "${req.body.score}" WHERE game_id = ${req.params.id};`);
            console.log("Game SCORE updated successfully");
            edit += 1;
        }
        else {
            res.status(400).send("Score is not valid!");
            return;
        }
    }
    if (req.body.date != null && req.body.date != "") {
        connection.query(`UPDATE games SET game_date = "${req.body.date}" WHERE game_id = ${req.params.id};`);
        console.log("Game DATE updated successfully");
        edit += 1;
    }
    if (req.body.time != null && req.body.time != "") {
        let time;
        if (timeFormat(req.body.time)) {
            time = timeFormat(req.body.time);
        }
        else {
            res.status(400).send("Time is not valid!");
            return;
        }
        connection.query(`UPDATE games SET game_time = "${time}" WHERE game_id = ${req.params.id};`);
        console.log("Game TIME updated successfully");
        edit += 1;
    }
    if (edit > 0) {
        res.status(200).send("The Game was edited successfully!");
        return;
    }
    else {
        res.status(400).send("Error Editing Game!");
        return;
    }
};
function isValidSeasonFormat(input) {
    const pattern = /^\d{4}\/\d{4}$/;
    if (pattern.test(input)) {
        const years = input.split("/");
        const startYear = parseInt(years[0], 10);
        const endYear = parseInt(years[1], 10);
        return endYear === startYear + 1;
    }
    return false;
}
function timeFormat(inputTime) {
    const pattern = /^([0-9]{1,2}):([0-5]?[0-9])$/;
    const match = inputTime.match(pattern);
    if (match) {
        const hour = match[1].padStart(2, '0');
        const minute = match[2].padStart(2, '0');
        return `${hour}:${minute}`;
    }
    else {
        return false;
    }
}
function isValidScoreFormat(input) {
    const pattern = /^\d{1,3}-\d{1,3}$/;
    if (pattern.test(input)) {
        const [team1Score, team2Score] = input.split("-").map(Number);
        return team1Score >= 0 && team2Score >= 0;
    }
    return false;
}
const deleteGame = (req, res) => {
    connection.query(`DELETE FROM games WHERE game_id = "${req.params.id}";`);
    res.status(200).send("Game deleted successfully");
};
const deleteAllGames = (req, res) => {
    connection.query(`DELETE FROM games;`);
    res.status(200).send("ALL Games deleted successfully");
};
const playerStatisticInGame = (req, res) => {
    console.log("Received game ID:", req.params.id);
    connection.query("SELECT a.athlete_id, a.athlete_name, a.athlete_team_name AS team_name, sa.statistic_points, sa.statistic_rebounds, sa.statistic_assists,sa.statistic_blocks, sa.statistic_steals, sa.statistic_turnovers, sa.statistic_three_pointers_made, sa.statistic_free_throws_made FROM athletes a JOIN statistics_athletes sa ON statistic_athlete_id = athlete_id WHERE sa.statistic_game_id  = ? ORDER BY athlete_team_name, athlete_name;", [req.params.id], (err, rows) => {
        if (err) {
            console.error("Error fetching player statistics:", err);
            res.status(500).send("Error fetching player statistics");
            return;
        }
        console.log(rows);
        res.json(rows);
    });
};
export default { getAllGamesByDate, getAllGamesByCompetition, getGameByCompetition, playerStatisticInGame, editGame, createGame, deleteAllGames, deleteGame };
