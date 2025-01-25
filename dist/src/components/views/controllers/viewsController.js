import teamsController from "../../teams/controllers/teamsController.js";
import competitionsController from "../../competitions/controllers/competitionsController.js";
import athletesController from "../../athletes/controllers/athletesController.js";
import favouritesController from "../../favourites/controllers/favouritesController.js";
import gamesController from "../../games/controllers/gamesController.js";
import statisticsController from "../../statistics/controllers/statisticsController.js";
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingGames = [];
        const pastGames = [];
        result.forEach((game) => {
            let gameDate;
            if (game.game_date instanceof Date) {
                gameDate = game.game_date;
            }
            else {
                gameDate = new Date(game.game_date);
            }
            if (gameDate.toString() === "Invalid Date") {
                console.error(`Invalid game_date: ${game.game_date}`);
                return;
            }
            game.game_date = gameDate.toISOString().split("T")[0];
            if (gameDate >= today) {
                upcomingGames.push(game);
            }
            else {
                pastGames.push(game);
            }
        });
        res.render("games", {
            up_games: upcomingGames,
            past_games: pastGames,
        });
    });
};
const showAllGamesByCompetitition = (req, res) => {
    gamesController.getAllGamesByCompetition(req, res, (result) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingGames = [];
        const pastGames = [];
        result.forEach((game) => {
            let gameDate;
            if (game.game_date instanceof Date) {
                gameDate = game.game_date;
            }
            else {
                gameDate = new Date(game.game_date);
            }
            if (gameDate.toString() === "Invalid Date") {
                console.error(`Invalid game_date: ${game.game_date}`);
                return;
            }
            game.game_date = gameDate.toISOString().split("T")[0];
            if (gameDate >= today) {
                upcomingGames.push(game);
            }
            else {
                pastGames.push(game);
            }
        });
        res.render("games", {
            up_games: upcomingGames,
            past_games: pastGames,
        });
    });
};
// STATISTICS
const showAllStatistics = (req, res) => {
    let athleteStats;
    let teamStats;
    statisticsController.athleteStatistics(req, res, (result) => {
        athleteStats = result;
        statisticsController.teamStatistics(req, res, (result) => {
            teamStats = result;
            res.render("statistics", {
                athletes: athleteStats,
                teams: teamStats
            });
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
    showAllStatistics,
    showIndex,
    showFavourites };
