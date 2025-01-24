import teamsController from "../../teams/controllers/teamsController.js";
import competitionsController from "../../competitions/controllers/competitionsController.js";
import athletesController from "../../athletes/controllers/athletesController.js";
import favouritesController from "../../favourites/controllers/favouritesController.js";
import gamesController from "../../games/controllers/gamesController.js";
// TEAMS
const showAllTeams = (req, res) => {
    teamsController.getAllTeams(req, res, (result) => {
        res.render("teams", {
            teams: result,
        });
    });
};
const showTeam = (req, res) => {
    teamsController.getTeamByName(req, res, (result) => {
        res.render("teams", {
            teams: result,
        });
    });
};
// COMPETITIONS
const showAllCompetitions = (req, res) => {
    competitionsController.getAllCompetitions(req, res, (result) => {
        res.render("competitions", {
            competitions: result,
        });
    });
};
const showCompetition = (req, res) => {
    teamsController.getTeamByName(req, res, (result) => {
        res.render("competitions", {
            competitions: result,
        });
    });
};
// ATHLETES
const showAllAthletes = (req, res) => {
    athletesController.getAllAthletes(req, res, (result) => {
        res.render("athletes", {
            athletes: result,
        });
    });
};
const showAthlete = (req, res) => {
    athletesController.getAthleteByName(req, res, (result) => {
        res.render("athlete", {
            athletes: result,
        });
    });
};
//GAMES 
const showAllGamesByDate = (req, res) => {
    gamesController.getAllGamesByDate(req, res, (result) => {
        res.render("games", {
            games: result,
        });
    });
};
const showAllGamesByCompetitition = (req, res) => {
    gamesController.getAllGamesByCompetition(req, res, (result) => {
        res.render("games", {
            games: result,
        });
    });
};
// INDEX
const showIndex = (req, res) => {
    res.render("index");
};
// FAVOURITES
const showFavourites = (req, res) => {
    favouritesController.showAllFavourites(req, res);
};
export default { showAllTeams, showTeam,
    showAllCompetitions, showCompetition,
    showAllAthletes, showAthlete,
    showAllGamesByDate, showAllGamesByCompetitition,
    showIndex,
    showFavourites };
