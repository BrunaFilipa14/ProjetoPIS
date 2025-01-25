import teamsController from "../../teams/controllers/teamsController.js";
import competitionsController from "../../competitions/controllers/competitionsController.js";
import athletesController from "../../athletes/controllers/athletesController.js";
import favouritesController from "../../favourites/controllers/favouritesController.js";
import gamesController from "../../games/controllers/gamesController.js";
// TEAMS
const showAllTeams = (req : any, res : any) => {
    teamsController.getAllTeams(req, res, (result) => {
        res.render("teams", {
            teams: result,
        });
    });
};
const showTeam = (req : any, res : any) => {
    teamsController.getTeamByName(req, res, (result) => {
        res.render("teams", {
            teams: result,
        });
    });
};
// COMPETITIONS
const showAllCompetitions = (req : any, res : any) => {
    competitionsController.getAllCompetitions(req, res, (result) => {
        res.render("competitions", {
            competitions: result,
        });
    });
};
const showCompetition = (req : any, res : any) => {
    teamsController.getTeamByName(req, res, (result) => {
        res.render("competitions", {
            competitions: result,
        });
    });
};
// ATHLETES
const showAllAthletes = (req : any, res : any) => {
    athletesController.getAllAthletes(req, res, (result) => {
        res.render("athletes", {
            athletes: result,
        });
    });
};
const showAthlete = (req : any, res : any) => {
    athletesController.getAthleteByName(req, res, (result) => {
        res.render("athlete", {
            athletes: result,
        });
    });
};
//GAMES 
const showAllGamesByDate = (req : any, res : any) => {
    gamesController.getAllGamesByDate(req, res, (result) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

        const upcomingGames : any= [];
        const pastGames : any= [];

        result.forEach((game : any) => {
            // Ensure `game_date` is parsed into a Date object
            let gameDate;
            if (game.game_date instanceof Date) {
                gameDate = game.game_date;
            } else {
                gameDate = new Date(game.game_date); // Convert string or other type to Date
            }

            if (gameDate.toString() === "Invalid Date") {
                console.error(`Invalid game_date: ${game.game_date}`);
                return; // Skip invalid dates
            }

            // Format game_date as YYYY-MM-DD (optional)
            game.game_date = gameDate.toISOString().split("T")[0];

            // Categorize games into upcoming and past
            if (gameDate >= today) {
                upcomingGames.push(game);
            } else {
                pastGames.push(game);
            }
        });

        // Render the games view with categorized data
        res.render("games", {
            up_games: upcomingGames,
            past_games: pastGames,
        });
    });
};

const showAllGamesByCompetitition = (req : any, res : any) => {
    gamesController.getAllGamesByCompetition(req, res, (result) => {
        res.render("games", {
            games: result,
        });
    });
};
// INDEX
const showIndex = (req : any, res : any) => {
    res.render("index");
};
// FAVOURITES
const showFavourites = (req : any, res : any) => {
    favouritesController.showAllFavourites(req, res);
};
export default { showAllTeams, showTeam,
    showAllCompetitions, showCompetition,
    showAllAthletes, showAthlete,
    showAllGamesByDate, showAllGamesByCompetitition,
    showIndex,
    showFavourites };
