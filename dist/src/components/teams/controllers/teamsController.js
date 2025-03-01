import * as mysql from 'mysql2';
import MYSQLPASSWORD from "../../../scripts/mysqlpassword.js";
import multer from 'multer';
import { fileURLToPath } from "url";
import path from 'path';
import fs from "fs";
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
// Configure Multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            console.log(req.body);
            cb(null, 'dist/public/images/teams/');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    })
});
const getAllTeams = (req, res, callback) => {
    connection.query("SELECT * FROM teams", (err, rows, fields) => {
        if (err)
            console.log(err);
        else {
            callback(rows);
        }
    });
};
const getTeamByName = (req, res, callback) => {
    connection.query(`SELECT * FROM teams WHERE team_name LIKE "%${req.params.name}%";`, (err, rows, fields) => {
        if (err) {
            console.error("Error: " + err);
        }
        else {
            callback(rows);
        }
    });
};
const createTeam = (req, res) => {
    upload.single('teamBadge')(req, res, (err) => {
        if (err) {
            console.error("Error during file upload:", err);
            return res.status(500).send("Failed to upload file.");
        }
        const { name, initials, formedYear, stadium, country } = req.body;
        const badgePath = req.file ? `/images/teams/${req.file.filename}` : null;
        connection.query(`INSERT INTO teams (team_name, team_initials, team_badge, team_formedYear, team_stadium, team_country) VALUES ("${name}", "${initials}", "${badgePath}", "${formedYear}", "${stadium}", "${country}");`, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Teams inserted: " + result.affectedRows);
                res.status(200).send(200);
            }
        });
    });
};
const editTeam = (req, res) => {
    upload.single('teamBadgeEdit')(req, res, (err) => {
        if (err) {
            console.error("Error during file upload:", err);
            return res.status(500).send("Failed to upload file.");
        }
        const { nameEdit, initialsEdit, formedYearEdit, stadiumEdit, countryEdit } = req.body;
        const badgePathEdit = req.file ? `/images/teams/${req.file.filename}` : null;
        if (nameEdit != null && nameEdit != "") {
            connection.query(`UPDATE teams SET team_name = "${nameEdit}" WHERE team_id = ${req.params.id};`);
            console.log("Team NAME updated successfully");
        }
        if (initialsEdit != null && initialsEdit != "") {
            connection.query(`UPDATE teams SET team_initials = "${initialsEdit}" WHERE team_id = ${req.params.id};`);
            console.log("Team INITIALS updated successfully");
        }
        if (badgePathEdit != null && badgePathEdit != "") {
            connection.query(`SELECT team_badge FROM teams WHERE team_id = "${req.params.id}";`, (err, rows, result) => {
                if (err) {
                    console.error("Error: " + err);
                }
                else if (rows.length > 0) {
                    let badgePath = rows[0].team_badge;
                    console.log(badgePath);
                    // Delete the image from the server
                    try {
                        fs.unlinkSync(`dist/public${badgePath}`);
                        console.log('File deleted!');
                    }
                    catch (err) {
                        console.error(err.message);
                    }
                }
                else {
                    res.status(404).send("The team doesn't exist!");
                }
            });
            connection.query(`UPDATE teams SET team_badge = "${badgePathEdit}" WHERE team_id = ${req.params.id};`);
            console.log("Team BADGE updated successfully");
        }
        if (formedYearEdit != null && formedYearEdit != "") {
            connection.query(`UPDATE teams SET team_formedYear = ${parseInt(formedYearEdit)} WHERE team_id = ${req.params.id};`);
            console.log("Team FORMED YEAR updated successfully");
        }
        if (stadiumEdit != null && stadiumEdit != "") {
            connection.query(`UPDATE teams SET team_stadium = "${stadiumEdit}" WHERE team_id = ${req.params.id};`);
            console.log("Team STADIUM updated successfully");
        }
        if (countryEdit != null && countryEdit != "") {
            connection.query(`UPDATE teams SET team_country = "${countryEdit}" WHERE team_id = ${req.params.id};`);
            console.log("Team COUNTRY updated successfully");
        }
        res.status(200).send("The team was edited successfully!");
    });
};
const deleteTeam = (req, res) => {
    connection.query(`SELECT team_badge FROM teams WHERE team_id = "${req.params.id}";`, (err, rows, result) => {
        if (err) {
            console.error("Error: " + err);
        }
        else if (rows.length > 0) {
            let badgePath = rows[0].team_badge;
            console.log(badgePath);
            // Delete the image from the server
            try {
                fs.unlinkSync(`dist/public${badgePath}`);
                console.log('File deleted!');
            }
            catch (err) {
                console.error(err.message);
            }
        }
        else {
            res.status(404).send("A equipa não existe!");
        }
    });
    connection.query(`DELETE FROM teams WHERE team_id = "${req.params.id}";`);
    res.status(200).send("Team deleted successfully");
};
const deleteAllTeams = (req, res) => {
    connection.query(`DELETE FROM teams;`);
    res.status(200).send("200");
};
const getTeamPlayers = (req, res) => {
    const teamName = req.params.name;
    const query = `SELECT athlete_name, athlete_birthDate, athlete_height, athlete_weight, athlete_nationality, athlete_position, athlete_team_name FROM athletes WHERE athlete_team_name LIKE ?`;
    connection.query(query, `%${teamName}%`, (err, rows) => {
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
const getTeamByCountry = (req, res, callback) => {
    connection.query(`SELECT * FROM teams WHERE team_country LIKE "%${req.params.name}%";`, (err, rows, fields) => {
        if (err) {
            console.error("Error: " + err);
        }
        else if (rows.length > 0) {
            callback(rows);
        }
        else {
            res.status(404).send("The team doesn't exist!");
        }
    });
};
export default { getAllTeams, getTeamByName, createTeam, editTeam, deleteTeam, deleteAllTeams, getTeamPlayers, getTeamByCountry };
