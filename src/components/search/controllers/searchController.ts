import * as mysql from 'mysql2';
import MYSQLPASSWORD from "../../../scripts/mysqlpassword.js";
import { Request, Response } from 'express';
import { fileURLToPath } from "url";
import path from 'path';
import fs from "fs";
import jwt from "jsonwebtoken";
import teamsController from '../../teams/controllers/teamsController.js';
import moment from "moment";

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



//Filter
const filterSearch = async (req: Request, res: Response) => {
    
};




//TEAMS
const getResultsTeams = async (req: Request, res: Response) => {
    try {
        let teams : any[] = [];

        const queryTeamName = new Promise((resolve, reject) => {
            connection.query<mysql.ResultSetHeader[]>(
                `SELECT * FROM teams WHERE team_name LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

        const queryTeamStadium = new Promise((resolve, reject) => {
            connection.query<mysql.ResultSetHeader[]>(
                `SELECT * FROM teams WHERE team_stadium LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

        const queryTeamCountry = new Promise((resolve, reject) => {
            connection.query<mysql.ResultSetHeader[]>(
                `SELECT * FROM teams WHERE team_country LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

        const queryTeamYear = new Promise((resolve, reject) => {
            connection.query<mysql.ResultSetHeader[]>(
                `SELECT * FROM teams WHERE team_formedYear LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });
        
        // Wait for all queries and combine results
        const results = await Promise.all([
            queryTeamName,
            queryTeamCountry,
            queryTeamYear,
            queryTeamStadium
        ]);

        // Flatten the nested arrays of results and filter out invalid entries
        teams = results.flat().filter((team:any) => team && team.team_name);

        const seen = new Set();
        teams = teams.filter((team: any) => {
            if (seen.has(team.team_name)) {
                return false;
            }
            seen.add(team.team_name);
            return true;
        });


        // Render the results
        res.render("searchResults", {
            teams: teams,
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("An error occurred while fetching results.");
    }
};

// ATHLETES
const getResultsAthletes = async (req: Request, res: Response) => {
    try {
        let athletes: any[] = [];

        // Create promises for all queries
        const queryAthleteName = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM athletes WHERE athlete_name LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

        const queryAthleteNationality = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM athletes WHERE athlete_nationality LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

        const queryAthletePosition = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM athletes WHERE athlete_position LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

        const queryAthleteTeam = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM athletes WHERE athlete_team_name LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

        const queryAthleteHeight = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM athletes WHERE athlete_height LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

        const queryAthleteWeight = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM athletes WHERE athlete_weight LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

        const queryAthleteBirthDate = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM athletes WHERE athlete_birthDate LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

        // Wait for all queries and combine results
        const results = await Promise.all([
            queryAthleteName,
            queryAthleteNationality,
            queryAthletePosition,
            queryAthleteTeam,
            queryAthleteHeight,
            queryAthleteWeight,
            queryAthleteBirthDate,
        ]);

        // Flatten the nested arrays of results and filter out invalid entries
        athletes = results.flat().filter((athlete:any) => athlete && athlete.athlete_name);

        const seen = new Set();
        athletes = athletes.filter((athlete: any) => {
            if (seen.has(athlete.athlete_name)) {
                return false;
            }
            seen.add(athlete.athlete_name);
            return true;
        });

        athletes = athletes.map((athlete) => ({
            ...athlete,
            athlete_birthDate: athlete.athlete_birthDate
                ? moment(athlete.athlete_birthDate).format("YYYY-MM-DD")
                : null,
        }));

        // Render the results
        res.render("searchResults", {
            athletes: athletes,
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("An error occurred while fetching results.");
    }
};

// COMPETITIONS
const getResultsCompetitions = async (req: Request, res: Response) => {
    try {
        let competitions: any[] = [];

        // Create promises for all queries
        const queryCompetitionName = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM competitions WHERE competition_name LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });


        // Wait for all queries and combine results
        const results = await Promise.all([
            queryCompetitionName
        ]);

        // Flatten the nested arrays of results and filter out invalid entries
        competitions = results.flat().filter((competition:any) => competition && competition.competition_name);

        const seen = new Set();
        competitions = competitions.filter((competition: any) => {
            if (seen.has(competition.competition_name)) {
                return false;
            }
            seen.add(competition.competition_name);
            return true;
        });


        // Render the results
        res.render("searchResults", {
            competitions: competitions,
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("An error occurred while fetching results.");
    }
};



export default {getResultsTeams, getResultsAthletes, getResultsCompetitions};