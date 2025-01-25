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
const athleteStatistics = (req, res, callback) => {
    connection.query("SELECT a.athlete_id, a.athlete_name, a.athlete_team_name AS team_name, SUM(sa.statistic_points) AS total_points, SUM(sa.statistic_rebounds) AS total_rebounds, SUM(sa.statistic_assists) AS total_assists, SUM(sa.statistic_blocks) AS total_blocks, SUM(sa.statistic_steals) AS total_steals, SUM(sa.statistic_turnovers) AS total_turnovers, SUM(sa.statistic_three_pointers_made) AS total_three_pointers_made, SUM(sa.statistic_free_throws_made) AS total_free_throws_made FROM athletes a JOIN statistics_athletes sa ON sa.statistic_athlete_id = a.athlete_id GROUP BY a.athlete_id, a.athlete_name, a.athlete_team_name ORDER BY a.athlete_team_name, a.athlete_name;", (err, rows) => {
        if (err) {
            console.error("Error fetching player statistics:", err);
            res.status(500).send("Error fetching player statistics");
            return;
        }
        console.log(rows);
        callback(rows);
    });
};
const teamStatistics = (req, res, callback) => {
    connection.query("SELECT t.team_id, a.athlete_team_name AS team_name, SUM(sa.statistic_points) AS total_points, SUM(sa.statistic_rebounds) AS total_rebounds, SUM(sa.statistic_assists) AS total_assists, SUM(sa.statistic_blocks) AS total_blocks, SUM(sa.statistic_steals) AS total_steals, SUM(sa.statistic_turnovers) AS total_turnovers, SUM(sa.statistic_three_pointers_made) AS total_three_pointers_made, SUM(sa.statistic_free_throws_made) AS total_free_throws_made FROM athletes a JOIN statistics_athletes sa ON sa.statistic_athlete_id = a.athlete_id JOIN teams t ON a.athlete_team_name = t.team_name GROUP BY a.athlete_team_name ORDER BY a.athlete_team_name;", (err, rows) => {
        if (err) {
            console.error("Error fetching player statistics:", err);
            res.status(500).send("Error fetching player statistics");
            return;
        }
        console.log(rows);
        callback(rows);
    });
};
export default { athleteStatistics, teamStatistics };
