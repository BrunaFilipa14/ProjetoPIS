"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql2"));
const mysqlpassword_1 = __importDefault(require("../../../scripts/mysqlpassword"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: mysqlpassword_1.default,
    database: "projeto"
};
const connection = mysql.createConnection(connectionOptions);
connection.connect();
// Configure Multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            console.log(req.body);
            cb(null, 'dist/public/images/teams/');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
        }
    })
});
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
    upload.single('teamBadge')(req, res, (err) => {
        var _a;
        if (err) {
            console.error("Error during file upload:", err);
            return res.status(500).send("Failed to upload file.");
        }
        //console.log("Uploaded file:", req.file); // Log the uploaded file
        console.log("Request body:", req.body); // Log the rest of the form data
        console.log("req file: " + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename));
        const { name, initials, formedYear, stadium, country } = req.body;
        const badgePath = req.file ? `/images/teams/${req.file.filename}` : null;
        console.log(__dirname);
        console.log(badgePath);
        //TODO Verifications
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
        console.log("body:");
        console.log(req.body);
        const { nameEdit, initialsEdit, formedYearEdit, stadiumEdit, countryEdit } = req.body;
        const badgePathEdit = req.file ? `/images/teams/${req.file.filename}` : null;
        console.log(badgePathEdit);
        if (nameEdit != null && nameEdit != "") {
            //TODO Verifications
            if (true) {
                connection.query(`UPDATE teams SET team_name = "${nameEdit}" WHERE team_id = ${req.params.id};`);
                console.log("Team NAME updated successfully");
            }
            else {
                res.status(400).send("");
            }
        }
        if (initialsEdit != null && initialsEdit != "") {
            //TODO Verifications
            if (true) {
                connection.query(`UPDATE teams SET team_initials = "${initialsEdit}" WHERE team_id = ${req.params.id};`);
                console.log("Team INITIALS updated successfully");
            }
            else {
                res.status(400).send("Numero invalido!");
            }
        }
        if (badgePathEdit != null && badgePathEdit != "") {
            //TODO Verifications
            if (true) {
                connection.query(`SELECT team_badge FROM teams WHERE team_id = "${req.params.id}";`, (err, rows, result) => {
                    if (err) {
                        console.error("Error: " + err);
                    }
                    else if (rows.length > 0) {
                        let badgePath = rows[0].team_badge;
                        console.log(badgePath);
                        // Delete the image from the server
                        try {
                            fs_1.default.unlinkSync(`dist/public${badgePath}`);
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
            else {
                res.status(400).send("");
            }
        }
        if (formedYearEdit != null && formedYearEdit != "") {
            //TODO Verifications
            if (true) {
                connection.query(`UPDATE teams SET team_formedYear = ${parseInt(formedYearEdit)} WHERE team_id = ${req.params.id};`);
                console.log("Team FORMED YEAR updated successfully");
            }
            else {
                res.status(400).send("");
            }
        }
        if (stadiumEdit != null && stadiumEdit != "") {
            //TODO Verifications
            if (true) {
                connection.query(`UPDATE teams SET team_stadium = "${stadiumEdit}" WHERE team_id = ${req.params.id};`);
                console.log("Team STADIUM updated successfully");
            }
            else {
                res.status(400).send("");
            }
        }
        if (countryEdit != null && countryEdit != "") {
            //TODO Verifications
            if (true) {
                connection.query(`UPDATE teams SET team_country = "${countryEdit}" WHERE team_id = ${req.params.id};`);
                console.log("Team COUNTRY updated successfully");
            }
            else {
                res.status(400).send("");
            }
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
                fs_1.default.unlinkSync(`dist/public${badgePath}`);
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
