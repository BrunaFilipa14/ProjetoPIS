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


const getAllAthletes = (req : Request, res : Response, callback: (result:any) => void) => {
    connection.query<mysql.RowDataPacket[]>("SELECT * FROM athletes", (err, rows, fields) => {
        if (err)
            console.log(err);
        else{
            rows.forEach(row => {
                row.athlete_birthDate = row.athlete_birthDate.toISOString().split('T')[0];
            });
            callback(rows);
        }
    });
};

const getAthleteByName = (req : Request, res : Response, callback: (result:any) => void) => {
    connection.query<mysql.ResultSetHeader[]>(`SELECT * FROM athletes WHERE athlete_name LIKE "%${req.params.name}%";`, (err, rows, fields) => {
        if(err){
            console.error("Error: " + err);
        }
        else{
            callback(rows);
        }
    })
};
 
const createAthlete = async (req : Request, res : Response) => {

    const checkTeamName = new Promise((resolve, reject) => {
                connection.query<mysql.RowDataPacket[]>(
                    `SELECT * FROM teams 
                        WHERE team_name LIKE ?`,
                    [`%${req.params.search}%`],
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

const editAthlete = (req : Request, res : Response) => {

    let edit = 0;
    console.log(req.body);
        if(req.body.name != null && req.body.name != ""){
            //TODO Verifications
            if(true){
                connection.query<mysql.ResultSetHeader>(`UPDATE athletes SET athlete_name = "${req.body.name}" WHERE athlete_id = ${req.params.id};`)
                console.log("Athlete NAME updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("");
            }
        }
        if(req.body.birthDate != null && req.body.birthDate != ""){
            //TODO Verifications
            if(true){
                connection.query<mysql.ResultSetHeader>(`UPDATE athletes SET athlete_birthDate = "${req.body.birthDate}" WHERE athlete_id = ${req.params.id};`)
                console.log("Athlete BIRTH DATE updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("Numero invalido!");
            }
        }
        if(req.body.height != null && req.body.height != ""){
            //TODO Verifications
            if(true){
                connection.query<mysql.ResultSetHeader>(`UPDATE athletes SET athlete_height = "${req.body.height}" WHERE athlete_id = ${req.params.id};`)
                console.log("Athlete HEIGHT updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("");
            }
        }
        if(req.body.weight != null && req.body.weight != ""){
            //TODO Verifications
            if(true){
                connection.query<mysql.ResultSetHeader>(`UPDATE athletes SET athlete_weight = "${req.body.weight}" WHERE athlete_id = ${req.params.id};`)
                console.log("Athlete WEIGHT updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("");
            }
        }
        if(req.body.nationality != null && req.body.nationality != ""){
            //TODO Verifications
            if(true){
                connection.query<mysql.ResultSetHeader>(`UPDATE athletes SET athlete_nationality = "${req.body.height}" WHERE athlete_id = ${req.params.id};`)
                console.log("Athlete NATIONALITY updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("");
            }
        }
        if(req.body.position != null && req.body.position != ""){
            //TODO Verifications
            if(true){
                connection.query<mysql.ResultSetHeader>(`UPDATE athletes SET athlete_position = "${req.body.position}" WHERE athlete_id = ${req.params.id};`)
                console.log("Athlete POSITION updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("");
            }
        }
        if(req.body.team != null && req.body.team != ""){
            //TODO Verifications
            if(true){
                connection.query<mysql.ResultSetHeader>(`UPDATE athletes SET athlete_team_name = "${req.body.team}" WHERE athlete_id = ${req.params.id};`)
                console.log("Athlete TEAM updated successfully");
                edit += 1;
            }
            else{
                res.status(400).send("");
            }
        }
        if(edit > 0){
            res.status(200).send("The Athlete was edited successfully!");
        }else{
            res.status(400).send("The Athlete was not edited!");
        }
}

const deleteAthlete = (req : Request, res : Response) => {
    connection.query<mysql.ResultSetHeader>(`DELETE FROM athletes WHERE athlete_id = "${req.params.id}";`);

    res.status(200).send("Athlete deleted successfully");
}

const deleteAllAthletes = (req : Request, res : Response) => {
    connection.query(`DELETE FROM athletes;`);

    res.status(200).send("200");
}


export default {getAllAthletes, getAthleteByName, createAthlete, editAthlete, deleteAthlete, deleteAllAthletes};