import * as mysql from "mysql2";
import MYSQLPASSWORD from "./mysqlpassword.js";
import { compare } from "bcrypt";
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
    const promises : Array<Promise<void>> = [];
    // Competitions that aren't in the 50 free competitions provided by the API, added manually
    await promises.push(populateQueryCompetitions(4546, 'EuroLeague Basketball'));

    // Fetch and populate Competitions
    await fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php")
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then((data) => {
            const basketballLeagues: Array<{ idLeague: number, strLeague: String, strSport: String }> = data.leagues.filter((league: { idLeague: number, strLeague: String, strSport: String }) => league.strSport == "Basketball");
            for (const competition of basketballLeagues) {
                promises.push(populateQueryCompetitions(competition.idLeague, competition.strLeague))
            }
        })
        .catch((error) => {
            console.error("Unable to fetch data:", error);
        });
    return Promise.all(promises);
}

//* POPULATE TEAMS
async function populateTeams() {
    const promises : Array<Promise<void>> = [];
    const competitions = await getCompetitionNames();

    // Fetch and populate teams
    console.log("competitions: ",competitions);
    for (const competition of competitions) {  //! Problema aqui
        console.log("test2");
        try{
            const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=${competition}`);
            if(!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            if(data.teams){
                for (const team of data.teams) {
                    promises.push(populateQueryTeams(team.strTeam, team.strTeamShort, team.strBadge, team.intFormedYear, team.strStadium, team.strCountry));
                }
            }   
        }catch(Error)
        {
            console.error("Unable to fetch data:", Error);
        }
    }
    return;
}

function populateQueryCompetitions(competitionId: number, competitionName: String): Promise<void> {
    connection.query<mysql.ResultSetHeader>((`INSERT INTO competitions (competition_id, competition_name) VALUES (${competitionId},'${competitionName}');`), (err, result) => {
        if (err) {
            console.log(err);
            return Promise.reject(err);
        }
    });
    console.log(`${competitionName} added to table COMPETITIONS!`);
    return Promise.resolve();
}

function populateQueryTeams(teamName: string, teamInitials: string, teamBadge: string, teamFormedYear: number, teamStadium: string, teamCountry: string) : Promise<void>{
    connection.query<mysql.ResultSetHeader>((`INSERT INTO teams (team_name, team_initials, team_badge, team_formedYear, team_stadium, team_country) VALUES ('${teamName}','${teamInitials}','${teamBadge}',${teamFormedYear},'${teamStadium}','${teamCountry}');`), (err, result) => {
        if (err) {
            console.log(err);
            return Promise.reject(err);
        }
    });
    console.log(`${teamName} added to table TEAMS!`);
    return Promise.resolve();
}

function getCompetitionNames(): Array<String> {
//Interface para query
interface CompetitionQueryResult extends mysql.RowDataPacket {
    competition_id: number;
    competition_name: string;
}

let competitions: Array<String> = [];
    connection.query<CompetitionQueryResult[]>((`SELECT competition_name FROM competitions;`), (err, rows, result) => {
        if (err) {
            console.log(err);
        }
        else {
            rows.forEach((row) => {
                competitions.push(row.competition_name);
            });
            console.log("rows: ", rows);
            console.log("TEAMS TABLE data transferred to array");
        }
    });

    return competitions;
}