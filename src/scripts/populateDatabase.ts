import * as mysql from "mysql2";
import * as fs from "fs/promises";
import MYSQLPASSWORD from "./mysqlpassword.js";
import { compare } from "bcrypt";
import { json } from "stream/consumers";
const connectionOptions: mysql.ConnectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: MYSQLPASSWORD
}
const connection: mysql.Connection = mysql.createConnection(connectionOptions);
main();

//* MAIN
async function main() {
    try {
        await populateCompetitions();
        await populateTeams();
        await populateAthletes();
    }
    catch (err) {
        console.log("Error Populating: ", err);
    }
    finally {
        connection.end((err) => {
            if (err) {
                console.error("Error closing the connection:", err);
            } else {
                console.log("connection closed.");
            }
        });
    }
}

//* POPULATE COMPETITIONS
async function populateCompetitions() {
    await populateQueryCompetitions(4546, 'EuroLeague Basketball');
    try{
        const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php");
        if(!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        const basketballLeagues: Array<{ idLeague: number, strLeague: String, strSport: String }> = data.leagues.filter((league: { idLeague: number, strLeague: String, strSport: String }) => league.strSport == "Basketball");
        
        for (const competition of basketballLeagues) {
                await populateQueryCompetitions(competition.idLeague, competition.strLeague);
        }
    }catch(error){
        throw new Error(`Cannot fetch data, error:${error}`);
    }
}

//* POPULATE TEAMS
//! Quando vai popular BC Andorra, dá erro porque o estádio tem ' no nome, por arranjar
async function populateTeams() {
    try{
        const competitions = await getCompetitionNames();
        console.log(competitions);
        for (const competition of competitions) {
            const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${competition}`);
            if(!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
            const data = await res.json();
            if(data.teams){
                for (const team of data.teams) {
                    await populateQueryTeams(team.strTeam, team.strTeamShort, team.strBadge, team.intFormedYear, team.strStadium, team.strCountry);
                }
            }

        }
    }catch(error){
        throw new Error(`Cannot fetch data, error:${error}`)
    }
}

//* POPULATE ATHLETES
//! Quando vai popular De'Aaron Fox, dá erro porque o nome tem ', por arranjar
async function populateAthletes(){
    const jsonData : string = await fs.readFile('dist/src/components/athlete/data/players.json', 'utf-8');
    const athletes : Array<{
        team_name : string, 
        players : Array<{
            name : string,
            date_of_birth : string,
            height_cm : number,
            weight_kg : number,
            nationality : string,
            position: string
        }>
    }> = JSON.parse(jsonData);
    try{
        for (const teamAthletes of athletes) {
            for (const athlete of teamAthletes.players) {
                await populateQueryAthletes(teamAthletes.team_name,athlete.name,athlete.date_of_birth,athlete.height_cm,athlete.weight_kg,athlete.nationality,athlete.position)
            }
        }
    }catch(error){
        throw new Error(`Cannot populate table, error:${error}`)
    }
}


//* POPULATE QUERIES
function populateQueryCompetitions(competitionId: number, competitionName: String): Promise<void> {
    return new Promise((resolve,reject) =>{
        connection.query<mysql.ResultSetHeader>((`INSERT IGNORE INTO competitions (competition_id, competition_name) VALUES (${competitionId},'${competitionName}');`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`${competitionName} added to table COMPETITIONS!`);
        resolve();
    })
    
}
function populateQueryTeams(teamName: string, teamInitials: string, teamBadge: string, teamFormedYear: number, teamStadium: string, teamCountry: string) : Promise<void>{
    return new Promise((resolve, reject) =>{
        connection.query<mysql.ResultSetHeader>((`INSERT IGNORE INTO teams (team_name, team_initials, team_badge, team_formedYear, team_stadium, team_country) VALUES ('${teamName}','${teamInitials}','${teamBadge}',${teamFormedYear},'${teamStadium}','${teamCountry}');`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`${teamName} added to table TEAMS!`);
        resolve();
    })
}

function populateQueryAthletes(team_name : string, name : string, date_of_birth : string, height_cm : number, weight_kg : number, nationality : string, position: string) : Promise<void>{
    return new Promise((resolve,reject) =>{
        connection.query<mysql.ResultSetHeader>((`INSERT IGNORE INTO athletes (athlete_name, athlete_birthDate, athlete_height, athlete_weight, athlete_nationality, athlete_position, athlete_team_name) VALUES ('${name}','${date_of_birth}','${height_cm}',${weight_kg},'${nationality}','${position}','${team_name}');`), (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
        });
        console.log(`${name} added to table Athletes!`);
        resolve();
    })
}

//* GET DATA FROM DATABASE QUERIES
function getCompetitionNames(): Promise<Array<String>> {
    //Interface para query
    interface CompetitionQueryResult extends mysql.RowDataPacket {
        competition_id: number;
        competition_name: string;
    }
    return new Promise((resolve,reject) =>{
        connection.query<CompetitionQueryResult[]>((`SELECT competition_name FROM competitions;`), (err, rows, result) => {
            if (err) {
                console.log(err);
                reject();
            }
            else {
                const competitions : Array<String> = rows.map((row: { competition_name: string }) => row.competition_name);
                console.log("rows: ", rows);
                console.log("COMPETITIONS TABLE data transferred to array");
                resolve(competitions);
            }
        });
    })
}