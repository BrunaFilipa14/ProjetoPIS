"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql2");
const mysqlpassword_1 = require("../../../scripts/mysqlpassword");
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: mysqlpassword_1.default,
    database: "projeto"
};
const connection = mysql.createConnection(connectionOptions);
connection.connect();
const getAllTeams = (req, res) => {
    connection.query("SELECT * FROM teams", (err, rows, fields) => {
        if (err)
            console.log(err);
        else {
            res.status(200).render('teams', {
                teams: rows
            });
        }
    });
};
const getTeamByName = (req, res) => {
    connection.query(`SELECT * FROM teams WHERE team_name = "${req.params.name}";`, (err, rows, fields) => {
        if (err) {
            console.error("Error: " + err);
        }
        else if (rows.length > 0) {
            res.status(200).render('teams', {
                teams: rows
            });
        }
        else {
            res.status(404).send("A equipa não existe!");
        }
    });
};
const createTeam = (req, res) => {
    let name = req.body.name;
    let initials = req.body.initials;
    //let badge = req.body.badge;
    let formedYear = parseInt(req.body.formedYear);
    let stadium = req.body.stadium;
    let country = req.body.country;
    //TODO Verifications
    connection.query(`INSERT INTO teams (team_name, team_initials, team_formedYear, team_stadium, team_country) VALUES ("${name}", "${initials}", ${formedYear}, "${stadium}", "${country}");`, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Teams inserted: " + result.affectedRows);
            res.status(200).send(200);
        }
    });
};
const editTeam = (req, res) => {
    if (req.body.name != null) {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE teams SET team_name = "${req.body.name}" WHERE team_id = ${req.params.id};`);
            console.log("Team NAME updated successfully");
        }
        else {
            res.status(400).send("");
        }
    }
    if (req.body.initials != null) {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE teams SET team_initials = "${req.body.initials}" WHERE team_id = ${req.params.id};`);
            console.log("Team INITIALS updated successfully");
        }
        else {
            res.status(400).send("Numero invalido!");
        }
    }
    if (req.body.formedYear != null) {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE teams SET team_formedYear = ${parseInt(req.body.formedYear)} WHERE team_id = ${req.params.id};`);
            console.log("Team FORMED YEAR updated successfully");
        }
        else {
            res.status(400).send("");
        }
    }
    if (req.body.stadium != null) {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE teams SET team_stadium = "${req.body.stadium}" WHERE team_id = ${req.params.id};`);
            console.log("Team STADIUM updated successfully");
        }
        else {
            res.status(400).send("");
        }
    }
    if (req.body.country != null) {
        //TODO Verifications
        if (true) {
            connection.query(`UPDATE teams SET team_country = "${req.body.country}" WHERE team_id = ${req.params.id};`);
            console.log("Team COUNTRY updated successfully");
        }
        else {
            res.status(400).send("");
        }
    }
    res.status(200).send("The team was edited successfully!");
};
const deleteTeam = (req, res) => {
    connection.query(`DELETE FROM teams WHERE team_id = "${req.params.id}";`);
    res.status(200).send("Team deleted successfully");
};
const deleteAllTeams = (req, res) => {
    connection.query(`DELETE FROM teams;`);
    res.status(200).send("200");
};
const getTeamPlayers = (req, res) => {
    const teamName = req.params.name;
    const query = `SELECT athlete_name, athlete_birthDate, athlete_height, athlete_weight, athlete_nationality, athlete_position, athlete_team_name FROM athletes WHERE athlete_team_name = ?`;
    connection.query(query, [teamName], (err, rows) => {
        if (err) {
            console.error("Error fetching players:", err);
            return res.status(500).json({ error: "Failed to fetch players." });
        }
        rows.forEach(row => {
            row.athlete_birthDate = row.athlete_birthDate.toISOString().split('T')[0]; // Remove time from Date
        });
        res.status(200).json(rows);
    });
};
module.exports.getAllTeams = getAllTeams;
module.exports.getTeamByName = getTeamByName;
module.exports.createTeam = createTeam;
module.exports.editTeam = editTeam;
module.exports.deleteTeam = deleteTeam;
module.exports.deleteAllTeams = deleteAllTeams;
module.exports.getTeamPlayers = getTeamPlayers;
