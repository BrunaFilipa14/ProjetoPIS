import teamsController from "../../teams/controllers/teamsController.js";
import competitionsController from "../../competitions/controllers/competitionsController.js";
import athletesController from "../../athletes/controllers/athletesController.js";
import favouritesController from "../../favourites/controllers/favouritesController.js";
import gamesController from "../../games/controllers/gamesController.js";

// TEAMS
const showAllTeams = (req: any, res: any) => {

    teamsController.getAllTeams(req, res, (result) => {
        res.render("teams", {
            teams: result,
        });
    });

}

const showTeam = (req: any, res: any) => {

    teamsController.getTeamByName(req, res, (result) => {
        res.render("teams", {
            teams: result,
        });
    })
}

// COMPETITIONS
const showAllCompetitions = (req: any, res: any) => {

    competitionsController.getAllCompetitions(req, res, (result) => {
        res.render("backofficeCompetitions", {
            competitions: result,
        });
    });
}

const showCompetition = (req: any, res: any) => {

    teamsController.getTeamByName(req, res, (result) => {
        res.render("backofficeCompetitions", {
            competitions: result,
        });
    })
}


// ATHLETES
const showAllAthletes = (req: any, res: any) => {

    athletesController.getAllAthletes(req, res, (result) => {
        res.render("athletes", {
            athletes: result,
        });
    });

}

const showAthlete = (req: any, res: any) => {

    athletesController.getAthleteByName(req, res, (result) => {
        res.render("athlete", {
            athletes: result,
        });
    })
}

//GAMES 
const showAllGames = (req:any, res:any) => {
    gamesController.getAllGames(req, res, (result) => {
        res.render("games", {
            games: result,
        });
    })
}

const showGameByDate = (req:any, res:any) => {
    gamesController.getGameByDate(req, res, (result) => {
        res.render("games", {
            games: result,
        });
    })
}


// INDEX
const showIndex = (req: any, res: any) => {
    res.render("index");
}

// FAVOURITES
const showFavourites = (req: any, res: any) => {
    favouritesController.showAllFavourites(req,res);
};

export default { showAllTeams, showTeam, 
                showAllCompetitions, showCompetition, 
                showAllAthletes, showAthlete,
                showAllGames, showGameByDate,
                showIndex, 
                showFavourites};