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
// TEAMS
const addFavouriteTeam = (req, res) => {
    if (!req.userId || !req.body.id) {
        return res.status(400).json({ error: "User ID and Team ID are required" });
    }
    const query = `INSERT INTO fav_teams (fav_team_user_id, fav_team_team_id) VALUES (?, ?);`;
    connection.query(query, [req.userId, req.body.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(201).json({ added: true });
        }
    });
};
const removeFavouriteTeam = (req, res) => {
    const query = `DELETE FROM fav_teams WHERE (fav_team_user_id = ? AND fav_team_team_id = ?);`;
    connection.query(query, [req.userId, req.body.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(200).json({ removed: true });
        }
    });
};
const checkFavouriteTeams = (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    const query = `SELECT fav_team_team_id FROM fav_teams WHERE fav_team_user_id = ?;`;
    connection.query(query, [userId], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
        else {
            const favouriteTeams = rows.map((row) => row.fav_team_team_id);
            res.status(200).json({ favouriteTeams });
        }
    });
};
const showFavouriteTeams = (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    const query = `SELECT fav_team_team_id FROM fav_teams WHERE fav_team_user_id = ?;`;
    connection.query(query, [userId], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
        else {
            console.log(rows);
            const teamIds = rows.map((row) => row.fav_team_team_id);
            connection.query(`SELECT * FROM teams WHERE team_id IN (?);`, [(teamIds)], (err, rows) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: err.message });
                }
                else {
                    res.render("favourites", {
                        teams: rows
                    });
                }
            });
        }
    });
};
// ATHLETES
const addFavouriteAthlete = (req, res) => {
    if (!req.userId || !req.body.id) {
        return res.status(400).json({ error: "User ID and Athlete ID are required" });
    }
    const query = `INSERT INTO fav_athletes (fav_athlete_user_id, fav_athlete_athlete_id) VALUES (?, ?);`;
    connection.query(query, [req.userId, req.body.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(201).json({ added: true });
        }
    });
};
const removeFavouriteAthlete = (req, res) => {
    const query = `DELETE FROM fav_athletes WHERE (fav_athlete_user_id = ? AND fav_athlete_athlete_id = ?);`;
    connection.query(query, [req.userId, req.body.id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(200).json({ removed: true });
        }
    });
};
const checkFavouriteAthletes = (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    const query = `SELECT fav_athlete_athlete_id FROM fav_athletes WHERE fav_athlete_user_id = ?;`;
    connection.query(query, [userId], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
        else {
            const favouriteAthletes = rows.map((row) => row.fav_athlete_athlete_id);
            res.status(200).json({ favouriteAthletes });
        }
    });
};
const showFavouriteAthletes = (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    const query = `SELECT fav_athlete_athlete_id FROM fav_athletes WHERE fav_athlete_user_id = ?;`;
    connection.query(query, [userId], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
        else {
            console.log(rows);
            const athleteIds = rows.map((row) => row.fav_athlete_athlete_id);
            connection.query(`SELECT * FROM athletes WHERE athlete_id IN (?);`, [(athleteIds)], (err, rows) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: err.message });
                }
                else {
                    console.log(rows);
                    res.render("favourites", {
                        athletes: rows
                    });
                }
            });
        }
    });
};
const showAllFavourites = async (req, res) => {
    const userId = req.userId;
    let athletes;
    let teams;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    const queryAthlete = `SELECT fav_athlete_athlete_id FROM fav_athletes WHERE fav_athlete_user_id = ?;`;
    const favouriteAthletes = new Promise((resolve, reject) => {
        connection.query(queryAthlete, [userId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            else {
                const athleteIds = rows.map((row) => row.fav_athlete_athlete_id);
                if (athleteIds.length === 0) {
                    return resolve([]);
                }
                connection.query(`SELECT * FROM athletes WHERE athlete_id IN (?);`, [(athleteIds)], (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        rows.forEach(row => {
                            row.athlete_birthDate = row.athlete_birthDate.toISOString().split('T')[0];
                        });
                        resolve(rows || []);
                    }
                });
            }
        });
    });
    let athleteResults = await Promise.all([favouriteAthletes]);
    athletes = athleteResults.flat().filter((athlete) => athlete && athlete.athlete_name);
    const queryTeam = `SELECT fav_team_team_id FROM fav_teams WHERE fav_team_user_id = ?;`;
    const favouriteTeams = new Promise((resolve, reject) => {
        connection.query(queryTeam, [userId], (err, rows) => {
            if (err) {
                return reject(err);
            }
            else {
                const teamIds = rows.map((row) => row.fav_team_team_id);
                if (teamIds.length === 0) {
                    return resolve([]);
                }
                connection.query(`SELECT * FROM teams WHERE team_id IN (?);`, [(teamIds)], (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        resolve(rows || []);
                    }
                });
            }
        });
    });
    let teamResults = await Promise.all([favouriteTeams]);
    teams = teamResults.flat().filter((team) => team && team.team_name);
    res.render("favourites", {
        teams: teams,
        athletes: athletes
    });
};
export default { checkFavouriteTeams, addFavouriteTeam, removeFavouriteTeam, showFavouriteTeams,
    checkFavouriteAthletes, addFavouriteAthlete, removeFavouriteAthlete, showFavouriteAthletes,
    showAllFavourites
};
