import * as mysql from 'mysql2';
import MYSQLPASSWORD from "../../../scripts/mysqlpassword.js";
import { Request, Response } from 'express';
import { fileURLToPath } from "url";
import path from 'path';
import fs from "fs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionOptions : mysql.ConnectionOptions = {
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD,
    database: "projeto"
};
const connection : mysql.Connection = mysql.createConnection(connectionOptions);
connection.connect();


const getAllGamesByDate = (req : Request, res : Response, callback: (result:any) => void) => {
    connection.query<mysql.RowDataPacket[]>("SELECT c.competition_name, c.competition_season, g.game_id, g.game_time, ht.team_name AS house_team, vt.team_name AS visiting_team,g.game_result,g.game_date FROM games g JOIN teams ht ON g.game_house_team_id = ht.team_id JOIN teams vt ON g.game_visiting_team_id = vt.team_id JOIN competitions c ON g.game_competition_id = c.competition_id ORDER BY g.game_date DESC, g.game_time DESC; ", (err, rows, fields) => {
        if (err)
            console.log(err);
        else{
            rows.forEach(row => {
                row.game_date = row.game_date.toISOString().split('T')[0];
            });
            callback(rows);
        }
    });
};

const getAllGamesByCompetition = (req : Request, res : Response, callback: (result:any) => void) => {
    connection.query<mysql.RowDataPacket[]>("SELECT c.competition_name, c.competition_season, g.game_id, g.game_time, ht.team_name AS house_team, vt.team_name AS visiting_team,g.game_result,g.game_date FROM games g JOIN teams ht ON g.game_house_team_id = ht.team_id JOIN teams vt ON g.game_visiting_team_id = vt.team_id JOIN competitions c ON g.game_competition_id = c.competition_id ORDER BY c.competition_name,g.game_date DESC, g.game_time DESC; ", (err, rows, fields) => {
        if (err)
            console.log(err);
        else{
            rows.forEach(row => {
                row.game_date = row.game_date.toISOString().split('T')[0];
            });
            callback(rows);
        }
    });
};

const getGameByCompetition = (req : Request, res : Response, callback: (result:any) => void) => {

    connection.query<mysql.RowDataPacket[]>("SELECT c.competition_name, g.game_id, g.game_time, ht.team_name AS house_team, vt.team_name AS visiting_team, g.game_result, g.game_date FROM games g JOIN teams ht ON g.game_house_team_id = ht.team_id JOIN teams vt ON g.game_visiting_team_id = vt.team_id JOIN competitions c ON g.game_competition_id = c.competition_id WHERE g.game_competition_id = ? ORDER BY g.game_date, g.game_time DESC;", [req.body.competitionId], (err, rows) => {
         if (err) {
             console.error("Error fetching games:", err); 
        } else {
            rows.forEach(row => { row.game_date = row.game_date.toISOString().split("T")[0]; 
        }); 
        callback(rows); 
    } 
    }); 

};
 
const createGame = async (req : Request, res : Response) => {


    const checkTeamName = new Promise((resolve, reject) => {
                connection.query<mysql.RowDataPacket[]>(
                    `SELECT * FROM teams 
                        WHERE team_name LIKE ?`,
                    [`%${req.body.house_team}%`],
                    (err, rows) => {
                        if (err) return reject(err);
                        resolve(rows || []);
                    }
                );
            });
    
             const results = await Promise.all([checkTeamName]);

        //TODO Verifications
        connection.query<mysql.ResultSetHeader>(`INSERT INTO athletes (athlete_name, athlete_birthDate, athlete_height, athlete_weight, athlete_nationality, athlete_position, athlete_position) VALUES ("${req.body.name}", "${req.body.birthDate}", "${req.body.height}", "${req.body.weight}", "${req.body.nationality}", "${req.body.position}", "${req.body.team}");`, (err : Error, result : any) => {
            if (err){
                console.log(err);
            }else{
                console.log("Teams inserted: " + result.affectedRows)
                res.status(200).send(200);
            }
        });
}

const editGame = async (req : Request, res : Response) => {

    let edit = 0;
    console.log(req.body);
        if(req.body.competition != null && req.body.competition != ""){
            const queryCompetition = new Promise((resolve, reject) => {
                        connection.query<mysql.RowDataPacket[]>(
                            `SELECT * FROM competitions 
                                WHERE competition_name LIKE ?`,
                            [`%${req.body.competition}%`],
                            (err, rows) => {
                                if (err) return reject(err);
                                resolve(rows || []); // Ensure rows is always an array
                            }
                        );
            });
            
            const results = await Promise.all([queryCompetition]);

            if(results.length>0){
                connection.query<mysql.ResultSetHeader>(`UPDATE games SET game_competition = "${req.body.competition}" WHERE game_id = ${req.params.id};`)
                console.log("Game COMPETITION updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("");
            }
        }
        if(req.body.season != null && req.body.season != ""){
            if(isValidSeasonFormat(req.body.season)){
                connection.query<mysql.ResultSetHeader>(`UPDATE games SET game_competition = "${req.body.competition}" WHERE game_id = ${req.params.id};`)
                console.log("Game COMPETITION updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("");
            }
        }
        if(req.body.homeTeam != null && req.body.homeTeam != ""){
            const queryHomeTeam = new Promise((resolve, reject) => {
                        connection.query<mysql.RowDataPacket[]>(
                            `SELECT * FROM teams 
                                WHERE team_name LIKE ?`,
                            [`%${req.body.homeTeam}%`],
                            (err, rows) => {
                                if (err) return reject(err);
                                resolve(rows || []); // Ensure rows is always an array
                            }
                        );
            });
            
            const results = await Promise.all([queryHomeTeam]);
            if(results.length>0){
                connection.query<mysql.ResultSetHeader>(`UPDATE games SET game_home_team = "${req.body.homeTeam}" WHERE game_id = ${req.params.id};`)
                console.log("Game HOME TEAM updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("");
            }
        }
        if(req.body.awayTeam != null && req.body.awayTeam != ""){
            const queryAwayTeam = new Promise((resolve, reject) => {
                        connection.query<mysql.RowDataPacket[]>(
                            `SELECT * FROM teams 
                                WHERE team_name LIKE ?`,
                            [`%${req.body.awayTeam}%`],
                            (err, rows) => {
                                if (err) return reject(err);
                                resolve(rows || []); // Ensure rows is always an array
                            }
                        );
            });
            
            const results = await Promise.all([queryAwayTeam]);
            if(results.length>0){
                connection.query<mysql.ResultSetHeader>(`UPDATE games SET game_away_team = "${req.body.awayTeam}" WHERE game_id = ${req.params.id};`)
                console.log("Game AWAY TEAM updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("");
            }
        }if(req.body.score != null && req.body.score != ""){
            if(isValidScoreFormat(req.body.score)){
                connection.query<mysql.ResultSetHeader>(`UPDATE games SET game_score = "${req.body.score}" WHERE game_id = ${req.params.id};`)
                console.log("Game SCORE updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("");
            }
        }
        if(req.body.date != null && req.body.date != ""){
                connection.query<mysql.ResultSetHeader>(`UPDATE games SET game_date = "${req.body.score}" WHERE game_id = ${req.params.id};`)
                console.log("Game SCORE updated successfully");
                edit += 1;
        }
        else{
            res.status(400).send("");
        }
        if(edit > 0){
            res.status(200).send("The Athlete was edited successfully!");
        }else{
            res.status(400).send("The Athlete was not edited!");
        }
}

function isValidSeasonFormat(input : any) {
    const pattern = /^\d{4}\/\d{4}$/;

    if (pattern.test(input)) {
        const years = input.split("/");
        const startYear = parseInt(years[0], 10);
        const endYear = parseInt(years[1], 10);

        return endYear === startYear + 1;
    }

    return false;
}

function isValidScoreFormat(input : any) {
    // Regular expression to match scores like 20-90 or 120-140
    const pattern = /^\d{1,3}-\d{1,3}$/;
    if (pattern.test(input)) {
        const [team1Score, team2Score] = input.split("-").map(Number);
        return team1Score >= 0 && team2Score >= 0; // Scores must be non-negative numbers
    }
    return false; // Invalid format
}


const deleteAthlete = (req : Request, res : Response) => {
    connection.query<mysql.ResultSetHeader>(`DELETE FROM athletes WHERE athlete_id = "${req.params.id}";`);

    res.status(200).send("Athlete deleted successfully");
}

const deleteAllAthletes = (req : Request, res : Response) => {
    connection.query(`DELETE FROM athletes;`);

    res.status(200).send("200");
}

const playerStatisticInGame = (req: Request, res: Response) => {
    console.log("Received game ID:", req.params.id);


    connection.query<mysql.RowDataPacket[]>("SELECT a.athlete_id, a.athlete_name, a.athlete_team_name AS team_name, sa.statistic_points, sa.statistic_rebounds, sa.statistic_assists,sa.statistic_blocks, sa.statistic_steals, sa.statistic_turnovers, sa.statistic_three_pointers_made, sa.statistic_free_throws_made FROM athletes a JOIN statistics_athletes sa ON statistic_athlete_id = athlete_id WHERE sa.statistic_game_id  = ? ORDER BY athlete_team_name, athlete_name;", [req.params.id], (err, rows) => {
        if (err) {
            console.error("Error fetching player statistics:", err);
            res.status(500).send("Error fetching player statistics");
            return;
        }
        console.log(rows);
        res.json(rows);
    });
};



export default {getAllGamesByDate, getAllGamesByCompetition, getGameByCompetition, playerStatisticInGame, editGame};