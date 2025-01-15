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
const getAllCompetitions = (req, res, callback) => {
    connection.query("SELECT * FROM competitions", (err, rows, fields) => {
        if (err)
            console.log(err);
        else {
            callback(rows);
        }
    });
};
const getCompetitionByName = (req, res, callback) => {
    connection.query(`SELECT * FROM competitions WHERE competition_name LIKE "%${req.params.name}%";`, (err, rows, fields) => {
        if (err) {
            console.error("Error: " + err);
        }
        else if (rows.length > 0) {
            callback(rows);
        }
        else {
            res.status(404).send("The competition doesn't exist!");
        }
    });
};
const createCompetition = (req, res) => {
    //TODO Verifications
    connection.query(`INSERT INTO competitions (competition_name, competition_description) VALUES ("${req.body.name}", "${req.body.description}");`, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Competition inserted!");
            res.status(200).send(200);
        }
    });
};
