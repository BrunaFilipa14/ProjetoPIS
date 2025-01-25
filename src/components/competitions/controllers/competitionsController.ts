import * as mysql from 'mysql2';
import MYSQLPASSWORD from "../../../scripts/mysqlpassword.js";
import { Request, Response } from 'express';
import { fileURLToPath } from "url";
import path from 'path';
import fs from "fs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionOptions: mysql.ConnectionOptions = {
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD,
    database: "projeto"
};
const connection: mysql.Connection = mysql.createConnection(connectionOptions);
connection.connect();

const getAllCompetitions = (req: Request, res: Response, callback: (result: any) => void) => {
    connection.query("SELECT * FROM competitions", (err, rows, fields) => {
        if (err)
            console.log(err);
        else {
            callback(rows);
        }
    });
};

const getCompetitionByName = (req: Request, res: Response, callback: (result: any) => void) => {
    connection.query<mysql.ResultSetHeader[]>(`SELECT * FROM competitions WHERE competition_name LIKE "%${req.params.name}%";`, (err, rows, fields) => {
        if (err) {
            console.error("Error: " + err);
        }
        else if (rows.length > 0) {
            callback(rows);
        }
        else {
            res.status(404).send("The competition doesn't exist!")
        }
    })
};


const createCompetition = (req: Request, res: Response) => {
    connection.query<mysql.ResultSetHeader>(`INSERT INTO competitions (competition_name,competition_season) VALUES ("${req.body.name}","${req.body.season}");`, (err: Error, result: any) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Competition inserted!");
            res.status(200).send(200);
        }
    });
}

const editCompetition = (req: Request, res: Response) => {

    if (req.body.name != null && req.body.name != "") {
        connection.query<mysql.ResultSetHeader>(`UPDATE competitions SET competition_name = "${req.body.name}" WHERE competition_id = ${req.params.id};`)
        console.log("Competition NAME updated successfully");
    }
    res.status(200).send("The team was edited successfully!");
}

const deleteCompetition = (req: Request, res: Response) => {
    connection.query<mysql.ResultSetHeader>(`DELETE FROM competitions WHERE competition_id = "${req.params.id}";`);

    res.status(200).send("Competition deleted successfully");
}

const deleteAllCompetitions = (req: Request, res: Response) => {
    connection.query(`DELETE FROM competitions;`);

    res.status(200).send("200");
}

interface competitionGamesOutput extends mysql.ResultSetHeader {
    game_date: any,
    game_time: string,
    house_team_name: string,
    visiting_team_name: string,
    game_result: string
}

const getCompetitionGames = (req: Request, res: Response) => {
    const compId: number = parseInt(req.params.competitionId);

    const query = `
    SELECT g.game_date, g.game_time, ht.team_name AS house_team_name, vt.team_name AS visiting_team_name, g.game_result FROM games g JOIN teams ht ON g.game_house_team_id = ht.team_id JOIN teams vt ON g.game_visiting_team_id = vt.team_id WHERE g.game_competition_id = ?;`;

    connection.query<competitionGamesOutput[]>(query, compId, (err, rows) => {
        if (err) {
            console.error("Error fetching games:", err);
            return res.status(500).json({ error: "Failed to fetch games." });
        }
        rows.forEach(row => { row.game_date = row.game_date.toISOString().split("T")[0]; });
        res.status(200).json(rows);
    })
}

const getTeamsbyCompetitionId = (req: Request, res: Response) => {
    const compId: number = parseInt(req.params.competitionId);
    const query = `
    SELECT 
        t.team_id,
        t.team_name,
        t.team_badge,
        t.team_formedYear,
        t.team_stadium,
        t.team_country
    FROM 
        competitions_teams ct
    JOIN 
        teams t ON ct.team_id = t.team_id
    WHERE 
        ct.competition_id = ?;`;

    connection.query<competitionGamesOutput[]>(query, compId, (err, rows) => {
        if (err) {
            console.error("Error fetching teams:", err);
            return res.status(500).json({ error: "Failed to fetch teams." });
        }
        res.status(200).json(rows);
    })
}

const getTeamsbyCompetitionId = (req : Request, res : Response) =>{
    const compId : number = parseInt(req.params.id);
    const query = ` SELECT t.team_id, t.team_name, t.team_badge, t.team_formedYear, t.team_stadium, t.team_country FROM competitions_teams ct JOIN teams t ON ct.team_id = t.team_id WHERE ct.competition_id = ? GROUP BY t.team_id ORDER BY t.team_name;`;

        connection.query<competitionGamesOutput[]>(query,compId,(err,rows) =>{
            if(err){
                console.error("Error fetching teams:", err);
                return res.status(500).json({ error: "Failed to fetch teams." });
            }
            console.log(rows);
            res.status(200).json(rows);
        })
}


export default {getAllCompetitions, getCompetitionByName, createCompetition, editCompetition, deleteCompetition, deleteAllCompetitions, getCompetitionGames, getTeamsbyCompetitionId};
