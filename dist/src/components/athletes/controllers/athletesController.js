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
const getAllAthletes = (req, res, callback) => {
    connection.query("SELECT * FROM athletes", (err, rows, fields) => {
        if (err)
            console.log(err);
        else {
            rows.forEach(row => {
                row.athlete_birthDate = row.athlete_birthDate.toISOString().split('T')[0]; // Remove time from Date
            });
            callback(rows);
        }
    });
};
const getAthleteByName = (req, res, callback) => {
    connection.query(`SELECT * FROM athletes WHERE athlete_name LIKE "%${req.params.name}%";`, (err, rows, fields) => {
        if (err) {
            console.error("Error: " + err);
        }
        else if (rows.length > 0) {
            callback(rows);
        }
        else {
            res.status(404).send("The athlete doesn't exist!");
        }
    });
};
const createAthlete = (req, res) => {
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
    if (req.body.name != null && req.body.name != "") {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE athletes SET athlete_name = "${req.body.name}" WHERE athlete_id = ${req.params.id};`);
            console.log("Athlete NAME updated successfully");
        }
        else {
            res.status(400).send("");
        }
    }
    if (req.body.birthDate != null && req.body.birthDate != "") {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE athletes SET athlete_initials = "${req.body.birthDate}" WHERE athlete_id = ${req.params.id};`);
            console.log("Athlete BIRTH DATE updated successfully");
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
        }
        else {
            res.status(400).send("");
        }
    }
    res.status(200).send("The Athlete was edited successfully!");
};
const deleteAthlete = (req, res) => {
    connection.query(`DELETE FROM athletes WHERE athlete_id = "${req.params.id}";`);
    res.status(200).send("Athlete deleted successfully");
};
const deleteAllAthletes = (req, res) => {
    connection.query(`DELETE FROM athletes;`);
    res.status(200).send("200");
};
export default { getAllAthletes, getAthleteByName, createAthlete, editAthlete, deleteAthlete, deleteAllAthletes };
