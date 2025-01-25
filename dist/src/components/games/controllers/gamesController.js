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
    connection.query("SELECT c.competition_name, c.competition_season, g.game_id, ht.team_name AS house_team, vt.team_name AS visiting_team,g.game_result,g.game_date FROM games g JOIN teams ht ON g.game_house_team_id = ht.team_id JOIN teams vt ON g.game_visiting_team_id = vt.team_id JOIN competitions c ON g.game_competition_id = c.competition_id ORDER BY g.game_date DESC; ", (err, rows, fields) => {
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
    connection.query("SELECT c.competition_name, c.competition_season, g.game_id, ht.team_name AS house_team, vt.team_name AS visiting_team,g.game_result,g.game_date FROM games g JOIN teams ht ON g.game_house_team_id = ht.team_id JOIN teams vt ON g.game_visiting_team_id = vt.team_id JOIN competitions c ON g.game_competition_id = c.competition_id ORDER BY c.competition_name,g.game_date DESC; ", (err, rows, fields) => {
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
    connection.query("SELECT c.competition_name, g.game_id, ht.team_name AS house_team, vt.team_name AS visiting_team, g.game_result, g.game_date FROM games g JOIN teams ht ON g.game_house_team_id = ht.team_id JOIN teams vt ON g.game_visiting_team_id = vt.team_id JOIN competitions c ON g.game_competition_id = c.competition_id WHERE g.game_competition_id = ? ORDER BY g.game_date;", [req.body.competitionId], (err, rows) => {
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
    const checkTeamName = new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM teams 
                        WHERE team_name LIKE ?`, [`%${req.body.house_team}%`], (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows || []);
        });
    });
    const results = await Promise.all([checkTeamName]);
    //TODO Verifications
    connection.query(`INSERT INTO athletes (athlete_name, athlete_birthDate, athlete_height, athlete_weight, athlete_nationality, athlete_position, athlete_position) VALUES ("${req.body.name}", "${req.body.birthDate}", "${req.body.height}", "${req.body.weight}", "${req.body.nationality}", "${req.body.position}", "${req.body.team}");`, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Teams inserted: " + result.affectedRows);
            res.status(200).send(200);
        }
    });
};
const editAthlete = (req, res) => {
    let edit = 0;
    console.log(req.body);
    if (req.body.name != null && req.body.name != "") {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE athletes SET athlete_name = "${req.body.name}" WHERE athlete_id = ${req.params.id};`);
            console.log("Athlete NAME updated successfully");
            edit += 1;
        }
        else {
            res.status(400).send("");
        }
    }
    if (req.body.birthDate != null && req.body.birthDate != "") {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE athletes SET athlete_birthDate = "${req.body.birthDate}" WHERE athlete_id = ${req.params.id};`);
            console.log("Athlete BIRTH DATE updated successfully");
            edit += 1;
        }
        else {
            res.status(400).send("Numero invalido!");
        }
    }
    if (req.body.height != null && req.body.height != "") {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE athletes SET athlete_height = "${req.body.height}" WHERE athlete_id = ${req.params.id};`);
            console.log("Athlete HEIGHT updated successfully");
            edit += 1;
        }
        else {
            res.status(400).send("");
        }
    }
    if (req.body.weight != null && req.body.weight != "") {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE athletes SET athlete_weight = "${req.body.weight}" WHERE athlete_id = ${req.params.id};`);
            console.log("Athlete WEIGHT updated successfully");
            edit += 1;
        }
        else {
            res.status(400).send("");
        }
    }
    if (req.body.nationality != null && req.body.nationality != "") {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE athletes SET athlete_nationality = "${req.body.height}" WHERE athlete_id = ${req.params.id};`);
            console.log("Athlete NATIONALITY updated successfully");
            edit += 1;
        }
        else {
            res.status(400).send("");
        }
    }
    if (req.body.position != null && req.body.position != "") {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE athletes SET athlete_position = "${req.body.position}" WHERE athlete_id = ${req.params.id};`);
            console.log("Athlete POSITION updated successfully");
            edit += 1;
        }
        else {
            res.status(400).send("");
        }
    }
    if (req.body.team != null && req.body.team != "") {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE athletes SET athlete_team_name = "${req.body.team}" WHERE athlete_id = ${req.params.id};`);
            console.log("Athlete TEAM updated successfully");
            edit += 1;
        }
        else {
            res.status(400).send("");
        }
    }
    if (edit > 0) {
        res.status(200).send("The Athlete was edited successfully!");
    }
    else {
        res.status(400).send("The Athlete was not edited!");
    }
};
const deleteAthlete = (req, res) => {
    connection.query(`DELETE FROM athletes WHERE athlete_id = "${req.params.id}";`);
    res.status(200).send("Athlete deleted successfully");
};
const deleteAllAthletes = (req, res) => {
    connection.query(`DELETE FROM athletes;`);
    res.status(200).send("200");
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
export default { getAllGamesByDate, getAllGamesByCompetition, getGameByCompetition, playerStatisticInGame };
