import * as mysql from 'mysql2';
import MYSQLPASSWORD from "../../../scripts/mysqlpassword.js";
import { fileURLToPath } from "url";
import path from 'path';
import moment from "moment";
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
//TEAMS
const getResultsTeams = async (req, res) => {
    try {
        let teams = [];
        const queryTeam = new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM teams 
                    WHERE team_name LIKE ? 
                    OR team_stadium LIKE ?
                    OR team_country LIKE ?
                    OR team_formedYear LIKE ?`, [`%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`], (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows || []);
            });
        });
        const results = await Promise.all([queryTeam]);
        // Flatten the nested arrays of results and filter out invalid entries
        teams = results.flat().filter((team) => team && team.team_name);
        //Remove duplicates
        const seen = new Set();
        teams = teams.filter((team) => {
            if (seen.has(team.team_name)) {
                return false;
            }
            seen.add(team.team_name);
            return true;
        });
        return teams;
    }
    catch (err) {
        console.error("Error fetching team results:", err);
        res.status(500).send("An error occurred while fetching team results.");
    }
};
// ATHLETES
const getResultsAthletes = async (req, res) => {
    try {
        let athletes = [];
        const queryAthlete = new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM athletes 
                WHERE athlete_name LIKE ?
                OR athlete_birthDate LIKE ? 
                OR athlete_height LIKE ? 
                OR athlete_weight LIKE ?
                OR athlete_nationality LIKE ?
                OR athlete_position LIKE ? 
                OR athlete_team_name LIKE ? `, [`%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`, `%${req.params.search}%`], (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows || []);
            });
        });
        const results = await Promise.all([queryAthlete]);
        athletes = results.flat().filter((athlete) => athlete && athlete.athlete_name);
        const seen = new Set();
        athletes = athletes.filter((athlete) => {
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
        return athletes;
    }
    catch (err) {
        console.error("Error:", err);
        res.status(500).send("An error occurred while fetching results.");
    }
};
// COMPETITIONS
const getResultsCompetitions = async (req, res) => {
    try {
        let competitions = [];
        const queryCompetitionName = new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM competitions WHERE competition_name LIKE ?`, [`%${req.params.search}%`], (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows || []);
            });
        });
        const results = await Promise.all([
            queryCompetitionName
        ]);
        competitions = results.flat().filter((competition) => competition && competition.competition_name);
        const seen = new Set();
        competitions = competitions.filter((competition) => {
            if (seen.has(competition.competition_name)) {
                return false;
            }
            seen.add(competition.competition_name);
            return true;
        });
        return competitions;
    }
    catch (err) {
        console.error("Error:", err);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW ALL RESULTS
const showResultsAll = async (req, res) => {
    try {
        const competitions = await getResultsCompetitions(req, res);
        const athletes = await getResultsAthletes(req, res);
        const teams = await getResultsTeams(req, res);
        const url = await getUrl(req, res);
        res.render("searchResults", {
            athletes: athletes,
            teams: teams,
            competitions: competitions,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW ALL ATHLETES
const showAthletesResults = async (req, res) => {
    try {
        const athletes = await getResultsAthletes(req, res);
        const url = await getUrl(req, res);
        res.render("searchResults", {
            athletes: athletes,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW ALL RESULTS
const showTeamsResults = async (req, res) => {
    try {
        const teams = await getResultsTeams(req, res);
        const url = await getUrl(req, res);
        res.render("searchResults", {
            teams: teams,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW ALL COMPETITIONS
const showCompetitionsResults = async (req, res) => {
    try {
        const competitions = await getResultsCompetitions(req, res);
        const url = await getUrl(req, res);
        res.render("searchResults", {
            competitions: competitions,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW ALL ATHLETES ORDERED
const showAthletesResultsOrdered = async (req, res) => {
    try {
        const athletes = await getResultsAthletes(req, res);
        if (req.params.order === "asc") {
            athletes.sort((a, b) => a.athlete_name.localeCompare(b.athlete_name));
        }
        else if (req.params.order === "desc") {
            athletes.sort((a, b) => b.athlete_name.localeCompare(a.athlete_name));
        }
        const url = await getUrl(req, res);
        res.render("searchResults", {
            athletes: athletes,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW ALL TEAMS ORDERED
const showTeamsResultsOrdered = async (req, res) => {
    try {
        const teams = await getResultsTeams(req, res);
        if (req.params.order === "asc") {
            teams.sort((a, b) => a.team_name.localeCompare(b.team_name));
        }
        else if (req.params.order === "desc") {
            teams.sort((a, b) => b.team_name.localeCompare(a.team_name));
        }
        const url = await getUrl(req, res);
        res.render("searchResults", {
            teams: teams,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW ALL COMPETITIONS ORDERED
const showCompetitionsResultsOrdered = async (req, res) => {
    try {
        const competitions = await getResultsCompetitions(req, res);
        if (req.params.order === "asc") {
            competitions.sort((a, b) => a.competitions_name.localeCompare(b.competitions_name));
        }
        else if (req.params.order === "desc") {
            competitions.sort((a, b) => b.competitions_name.localeCompare(a.competitions_name));
        }
        const url = await getUrl(req, res);
        res.render("searchResults", {
            competitions: competitions,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW ALL RESULTS ORDERED
const showAllResultsOrdered = async (req, res) => {
    try {
        const teams = await getResultsTeams(req, res);
        const athletes = await getResultsAthletes(req, res);
        const competitions = await getResultsCompetitions(req, res);
        if (req.params.order === "asc") {
            if (teams.length > 0) {
                teams.sort((a, b) => a.team_name.localeCompare(b.team_name));
            }
            if (athletes.length > 0) {
                athletes.sort((a, b) => a.athlete_name.localeCompare(b.athlete_name));
            }
            if (competitions.length > 0) {
                competitions.sort((a, b) => a.competition_name.localeCompare(b.competition_name));
            }
        }
        else if (req.params.order === "desc") {
            if (teams.length > 0) {
                teams.sort((a, b) => b.team_name.localeCompare(a.team_name));
            }
            if (athletes.length > 0) {
                athletes.sort((a, b) => b.athlete_name.localeCompare(a.athlete_name));
            }
            if (competitions.length > 0) {
                competitions.sort((a, b) => b.competition_name.localeCompare(a.competition_name));
            }
        }
        const url = await getUrl(req, res);
        res.render("searchResults", {
            competitions: competitions,
            teams: teams,
            athletes: athletes,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//TEAMS BY NAME
const getResultsTeamsByName = async (req, res) => {
    try {
        let teams = [];
        const queryTeam = new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM teams 
                    WHERE team_name LIKE ?`, [`%${req.params.search}%`], (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows || []);
            });
        });
        const results = await Promise.all([queryTeam]);
        teams = results.flat().filter((team) => team && team.team_name);
        const seen = new Set();
        teams = teams.filter((team) => {
            if (seen.has(team.team_name)) {
                return false;
            }
            seen.add(team.team_name);
            return true;
        });
        return teams;
    }
    catch (err) {
        console.error("Error fetching team results:", err);
        res.status(500).send("An error occurred while fetching team results.");
    }
};
//ATHLETES BY NAME
const getResultsAthletesByName = async (req, res) => {
    try {
        let athletes = [];
        const queryAthlete = new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM athletes 
                WHERE athlete_name LIKE ?`, [`%${req.params.search}%`], (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows || []);
            });
        });
        const results = await Promise.all([queryAthlete]);
        athletes = results.flat().filter((athlete) => athlete && athlete.athlete_name);
        const seen = new Set();
        athletes = athletes.filter((athlete) => {
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
        return athletes;
    }
    catch (err) {
        console.error("Error:", err);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//COMPETITIONS BY NAME
const getResultsCompetitionsByName = async (req, res) => {
    try {
        let competitions = [];
        const queryCompetitionName = new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM competitions WHERE competition_name LIKE ?`, [`%${req.params.search}%`], (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows || []);
            });
        });
        const results = await Promise.all([
            queryCompetitionName
        ]);
        competitions = results.flat().filter((competition) => competition && competition.competition_name);
        const seen = new Set();
        competitions = competitions.filter((competition) => {
            if (seen.has(competition.competition_name)) {
                return false;
            }
            seen.add(competition.competition_name);
            return true;
        });
        return competitions;
    }
    catch (err) {
        console.error("Error:", err);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW ATHLETES BY NAME RESULTS
const showAthletesByNameResults = async (req, res) => {
    try {
        const athletesByName = await getResultsAthletesByName(req, res);
        const url = await getUrl(req, res);
        console.log("here");
        console.log(athletesByName);
        res.render("searchResults", {
            athletes: athletesByName,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW TEAMS BY NAME RESULTS
const showTeamsByNameResults = async (req, res) => {
    try {
        const teamsByName = await getResultsTeamsByName(req, res);
        const url = await getUrl(req, res);
        res.render("searchResults", {
            teams: teamsByName,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW TEAMS BY NAME RESULTS
const showCompetitionsByNameResults = async (req, res) => {
    try {
        const competitionsByName = await getResultsCompetitionsByName(req, res);
        const url = await getUrl(req, res);
        res.render("searchResults", {
            competitions: competitionsByName,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW ALL ATHLETES ORDERED
const showAthletesByNameResultsOrdered = async (req, res) => {
    try {
        const athletes = await getResultsAthletesByName(req, res);
        if (req.params.order === "asc") {
            athletes.sort((a, b) => a.athlete_name.localeCompare(b.athlete_name));
        }
        else if (req.params.order === "desc") {
            athletes.sort((a, b) => b.athlete_name.localeCompare(a.athlete_name));
        }
        const url = await getUrl(req, res);
        res.render("searchResults", {
            athletes: athletes,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW ALL TEAMS BY NAME ORDERED
const showTeamsByNameResultsOrdered = async (req, res) => {
    try {
        const teams = await getResultsTeamsByName(req, res);
        if (req.params.order === "asc") {
            teams.sort((a, b) => a.team_name.localeCompare(b.team_name));
        }
        else if (req.params.order === "desc") {
            teams.sort((a, b) => b.team_name.localeCompare(a.team_name));
        }
        const url = await getUrl(req, res);
        res.render("searchResults", {
            teams: teams,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
//SHOW COMPETITIONS BY NAME ORDERED
const showCompetitionsByNameResultsOrdered = async (req, res) => {
    try {
        const competitions = await getResultsCompetitionsByName(req, res);
        if (req.params.order === "asc") {
            competitions.sort((a, b) => a.competitions_name.localeCompare(b.competitions_name));
        }
        else if (req.params.order === "desc") {
            competitions.sort((a, b) => b.competitions_name.localeCompare(a.competitions_name));
        }
        const url = await getUrl(req, res);
        res.render("searchResults", {
            competitions: competitions,
            input: req.params.search,
            url: url
        });
    }
    catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).send("An error occurred while fetching results.");
    }
};
const getUrl = async (req, res) => {
    const parts = req.originalUrl.split('/');
    if (parts[parts.length - 1] == "asc" || parts[parts.length - 1] == "desc") {
        parts[parts.length - 1] = ""; // Replace the last part
    }
    let updatedUrl = parts.join('/');
    if (updatedUrl.endsWith('/'))
        updatedUrl = updatedUrl.slice(0, -1);
    return updatedUrl;
};
export default { getResultsTeams, getResultsAthletes, getResultsCompetitions, showResultsAll, showTeamsResults, showAthletesResults, showCompetitionsResults, showAthletesResultsOrdered, showTeamsResultsOrdered, showCompetitionsResultsOrdered, showAllResultsOrdered, showAthletesByNameResults, showTeamsByNameResults, showCompetitionsByNameResults, showAthletesByNameResultsOrdered, showCompetitionsByNameResultsOrdered, showTeamsByNameResultsOrdered };
