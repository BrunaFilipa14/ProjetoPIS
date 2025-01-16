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




//TEAMS
const getResultsTeams = async (req : Request, res : Response) => {
    try {
        let teams = [];
        
        const queryTeam = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM teams 
                    WHERE team_name LIKE ? 
                    OR team_stadium LIKE ?
                    OR team_country LIKE ?
                    OR team_formedYear LIKE ?`,
                [`%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

         const results = await Promise.all([queryTeam]);

        // Flatten the nested arrays of results and filter out invalid entries
        teams = results.flat().filter((team:any) => team && team.team_name);

        //Remove duplicates
        const seen = new Set();
        teams = teams.filter((team: any) => {
            if (seen.has(team.team_name)) {
                return false;
            }
            seen.add(team.team_name);
            return true;
        });
       
        return teams;

    } catch (err) {
        console.error("Error fetching team results:", err);
        res.status(500).send("An error occurred while fetching team results.");
    }
};


// ATHLETES
const getResultsAthletes = async (req: Request, res: Response) => {
    try {
        let athletes: any[] = [];

        // Create promises for all queries
        const queryAthlete = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM athletes 
                WHERE athlete_name LIKE ?
                OR athlete_birthDate LIKE ? 
                OR athlete_height LIKE ? 
                OR athlete_weight LIKE ?
                OR athlete_nationality LIKE ?
                OR athlete_position LIKE ? 
                OR athlete_team_name LIKE ? `,
                [`%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });


        const results = await Promise.all([queryAthlete]);

        // Flatten the nested arrays of results and filter out invalid entries
        athletes = results.flat().filter((athlete:any) => athlete && athlete.athlete_name);

        //Remove duplicates
        const seen = new Set();
        athletes = athletes.filter((athlete: any) => {
            if (seen.has(athlete.athlete_name)) {
                return false;
            }
            seen.add(athlete.athlete_name);
            return true;
        });

        //Format date format
        athletes = athletes.map((athlete) => ({
            ...athlete,
            athlete_birthDate: athlete.athlete_birthDate
                ? moment(athlete.athlete_birthDate).format("YYYY-MM-DD")
                : null,
        }));

        return athletes;

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

        return competitions;

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW ALL RESULTS
const showResultsAll = async (req: Request, res: Response) => {
    try {
        // Await the results of asynchronous functions
        const competitions = await getResultsCompetitions(req, res);
        const athletes = await getResultsAthletes(req, res);
        const teams = await getResultsTeams(req, res);

        const url = await getUrl(req, res);

        // Render the results
        res.render("searchResults", {
            athletes: athletes,
            teams: teams,
            competitions: competitions,
            input: req.params.search,
            url: url
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW ALL ATHLETES
const showAthletesResults = async (req: Request, res: Response) => {
    try {
        const athletes = await getResultsAthletes(req, res);

        const url = await getUrl(req, res);

        // Render the results
        res.render("searchResults", {
            athletes: athletes,
            input: req.params.search,
            url: url
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW ALL RESULTS
const showTeamsResults = async (req: Request, res: Response) => {
    try {
        const teams = await getResultsTeams(req, res);

        const url = await getUrl(req, res);

        // Render the results
        res.render("searchResults", {
            teams: teams,
            input: req.params.search,
            url: url
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW ALL COMPETITIONS
const showCompetitionsResults = async (req: Request, res: Response) => {
    try {
        const competitions = await getResultsCompetitions(req, res);

        const url = await getUrl(req, res);

        // Render the results
        res.render("searchResults", {
            competitions: competitions,
            input: req.params.search,
            url: url
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW ALL ATHLETES ORDERED
const showAthletesResultsOrdered = async (req: Request, res: Response) => {
    try {
        const athletes : any = await getResultsAthletes(req, res);

        if(req.params.order === "asc"){
            athletes.sort((a : any, b : any) => a.athlete_name.localeCompare(b.athlete_name));
        }
        else if(req.params.order === "desc"){
            athletes.sort((a : any, b : any) => b.athlete_name.localeCompare(a.athlete_name));
        }

        const url = await getUrl(req, res);

        // Render the results
        res.render("searchResults", {
            athletes: athletes,
            input: req.params.search,
            url: url
        });
    
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW ALL TEAMS ORDERED
const showTeamsResultsOrdered = async (req: Request, res: Response) => {
    try {
        const teams : any = await getResultsTeams(req, res);

        if(req.params.order === "asc"){
            teams.sort((a : any, b : any) => a.team_name.localeCompare(b.team_name));
        }
        else if(req.params.order === "desc"){
            teams.sort((a : any, b : any) => b.team_name.localeCompare(a.team_name));
        }

        const url = await getUrl(req, res);

        // Render the results
        res.render("searchResults", {
            teams: teams,
            input: req.params.search,
            url: url
        });
    
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW ALL COMPETITIONS ORDERED
const showCompetitionsResultsOrdered = async (req: Request, res: Response) => {
    try {
        const competitions : any = await getResultsCompetitions(req, res);

        if(req.params.order === "asc"){
            competitions.sort((a : any, b : any) => a.competitions_name.localeCompare(b.competitions_name));
        }
        else if(req.params.order === "desc"){
            competitions.sort((a : any, b : any) => b.competitions_name.localeCompare(a.competitions_name));
        }

       
        const url = await getUrl(req, res);
        

        // Render the results
        res.render("searchResults", {
            competitions: competitions,
            input: req.params.search,
            url: url
        });
    
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW ALL RESULTS ORDERED
const showAllResultsOrdered = async (req: Request, res: Response) => {
    try {
        const teams : any = await getResultsTeams(req, res);
        const athletes : any = await getResultsAthletes(req, res);
        const competitions : any = await getResultsCompetitions(req, res);

        if(req.params.order === "asc"){
            if(teams.length > 0)
            {
                teams.sort((a : any, b : any) => a.team_name.localeCompare(b.team_name));
            }
            if(athletes.length > 0){
                athletes.sort((a : any, b : any) => a.athlete_name.localeCompare(b.athlete_name));
            }
            if(competitions.length > 0){
                competitions.sort((a : any, b : any) => a.competition_name.localeCompare(b.competition_name));
            }
        }
        else if(req.params.order === "desc"){
            if(teams.length > 0)
            {
                teams.sort((a : any, b : any) => b.team_name.localeCompare(a.team_name));
            }
            if(athletes.length > 0){
                athletes.sort((a : any, b : any) => b.athlete_name.localeCompare(a.athlete_name));
            }
            if(competitions.length > 0){
                competitions.sort((a : any, b : any) => b.competition_name.localeCompare(a.competition_name));
            }   
        }

        const url = await getUrl(req, res);

        // Render the results
        res.render("searchResults", {
            competitions: competitions,
            teams: teams,
            athletes: athletes,
            input: req.params.search,
            url: url
        });
    
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};


//TEAMS BY NAME
const getResultsTeamsByName = async (req : Request, res : Response) => {
    try {
        let teams = [];
        
        const queryTeam = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM teams 
                    WHERE team_name LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });

         const results = await Promise.all([queryTeam]);

        // Flatten the nested arrays of results and filter out invalid entries
        teams = results.flat().filter((team:any) => team && team.team_name);

        //Remove duplicates
        const seen = new Set();
        teams = teams.filter((team: any) => {
            if (seen.has(team.team_name)) {
                return false;
            }
            seen.add(team.team_name);
            return true;
        });
       
        return teams;

    } catch (err) {
        console.error("Error fetching team results:", err);
        res.status(500).send("An error occurred while fetching team results.");
    }
};


//ATHLETES BY NAME
const getResultsAthletesByName = async (req: Request, res: Response) => {
    try {
        let athletes: any[] = [];

        // Create promises for all queries
        const queryAthlete = new Promise((resolve, reject) => {
            connection.query<mysql.RowDataPacket[]>(
                `SELECT * FROM athletes 
                WHERE athlete_name LIKE ?`,
                [`%${req.params.search}%`],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows || []); // Ensure rows is always an array
                }
            );
        });


        const results = await Promise.all([queryAthlete]);

        // Flatten the nested arrays of results and filter out invalid entries
        athletes = results.flat().filter((athlete:any) => athlete && athlete.athlete_name);

        //Remove duplicates
        const seen = new Set();
        athletes = athletes.filter((athlete: any) => {
            if (seen.has(athlete.athlete_name)) {
                return false;
            }
            seen.add(athlete.athlete_name);
            return true;
        });

        //Format date format
        athletes = athletes.map((athlete) => ({
            ...athlete,
            athlete_birthDate: athlete.athlete_birthDate
                ? moment(athlete.athlete_birthDate).format("YYYY-MM-DD")
                : null,
        }));

        return athletes;

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("An error occurred while fetching results.");
    }
};


//COMPETITIONS BY NAME
const getResultsCompetitionsByName = async (req: Request, res: Response) => {
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

        return competitions;

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW ATHLETES BY NAME RESULTS
const showAthletesByNameResults = async (req : Request, res : Response) => {
    try {
        const athletesByName : any = await getResultsAthletesByName(req, res);
        
        const url = await getUrl(req, res);
        console.log("here");
        console.log(athletesByName);

        // Render the results
        res.render("searchResults", {
            athletes: athletesByName,
            input: req.params.search,
            url: url
        });
    
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};


//SHOW TEAMS BY NAME RESULTS
const showTeamsByNameResults = async (req : Request, res : Response) => {
    try {
        const teamsByName : any = await getResultsTeamsByName(req, res);

        const url = await getUrl(req, res);

        // Render the results
        res.render("searchResults", {
            teams: teamsByName,
            input: req.params.search,
            url: url
        });
    
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW TEAMS BY NAME RESULTS
const showCompetitionsByNameResults = async (req : Request, res : Response) => {
    try {
        const competitionsByName : any = await getResultsCompetitionsByName(req, res);

        const url = await getUrl(req, res);

        // Render the results
        res.render("searchResults", {
            competitions: competitionsByName,
            input: req.params.search,
            url: url
        });
    
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW ALL ATHLETES ORDERED
const showAthletesByNameResultsOrdered = async (req: Request, res: Response) => {
    try {
        const athletes : any = await getResultsAthletesByName(req, res);

        if(req.params.order === "asc"){
            athletes.sort((a : any, b : any) => a.athlete_name.localeCompare(b.athlete_name));
        }
        else if(req.params.order === "desc"){
            athletes.sort((a : any, b : any) => b.athlete_name.localeCompare(a.athlete_name));
        }

        const url = await getUrl(req, res);

        // Render the results
        res.render("searchResults", {
            athletes: athletes,
            input: req.params.search,
            url: url
        });
    
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW ALL TEAMS BY NAME ORDERED
const showTeamsByNameResultsOrdered = async (req: Request, res: Response) => {
    try {
        const teams : any = await getResultsTeamsByName(req, res);

        if(req.params.order === "asc"){
            teams.sort((a : any, b : any) => a.team_name.localeCompare(b.team_name));
        }
        else if(req.params.order === "desc"){
            teams.sort((a : any, b : any) => b.team_name.localeCompare(a.team_name));
        }

        const url = await getUrl(req, res);

        // Render the results
        res.render("searchResults", {
            teams: teams,
            input: req.params.search,
            url: url
        });
    
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};

//SHOW COMPETITIONS BY NAME ORDERED
const showCompetitionsByNameResultsOrdered = async (req: Request, res: Response) => {
    try {
        const competitions : any = await getResultsCompetitionsByName(req, res);

        if(req.params.order === "asc"){
            competitions.sort((a : any, b : any) => a.competitions_name.localeCompare(b.competitions_name));
        }
        else if(req.params.order === "desc"){
            competitions.sort((a : any, b : any) => b.competitions_name.localeCompare(a.competitions_name));
        }

       
        const url = await getUrl(req, res);
        

        // Render the results
        res.render("searchResults", {
            competitions: competitions,
            input: req.params.search,
            url: url
        });
    
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};




const getUrl = async (req: Request, res: Response) => {

    const parts = req.originalUrl.split('/');
    if(parts[parts.length - 1] == "asc" || parts[parts.length - 1] == "desc" ){
        parts[parts.length - 1] = ""; // Replace the last part
    }
    let updatedUrl = parts.join('/');
    if (updatedUrl.endsWith('/'))
    updatedUrl = updatedUrl.slice(0, -1);

    return updatedUrl;
}


export default {getResultsTeams, getResultsAthletes, getResultsCompetitions, showResultsAll, showTeamsResults, showAthletesResults, showCompetitionsResults, showAthletesResultsOrdered, showTeamsResultsOrdered, showCompetitionsResultsOrdered, showAllResultsOrdered, showAthletesByNameResults, showTeamsByNameResults, showCompetitionsByNameResults, showAthletesByNameResultsOrdered, showCompetitionsByNameResultsOrdered, showTeamsByNameResultsOrdered};