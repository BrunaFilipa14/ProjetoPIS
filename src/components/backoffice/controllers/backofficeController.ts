import teamsController from "../../teams/controllers/teamsController.js";
import athletesController from "../../athletes/controllers/athletesController.js";
import gamesController from "../../games/controllers/gamesController.js";
import competitionsController from "../../competitions/controllers/competitionsController.js";

const showBackoffice = async (req : any, res : any) => {
    let teams;
    let athletes;
    let games;
    let competitions;


    teams = await new Promise((resolve, reject) => {
        (teamsController.getAllTeams(req, res, (result) => {
            if (result.length > 0) {
                resolve(result || []);
            }
            else {
                return resolve([]);
            }
            return reject();
        }));
    });


    athletes = await new Promise((resolve, reject) => {
        (athletesController.getAllAthletes(req, res, (result) => {
            if (result.length > 0) {
                resolve(result || []);
            }
            else {
                return resolve([]);
            }
            return reject();
        }));
    });


    games = await new Promise((resolve, reject) => {
        (gamesController.getAllGamesByDate(req, res, (result) => {
            if (result.length > 0) {
                resolve(result || []);
            }
            else {
                return resolve([]);
            }
            return reject();
        }));
    });


    competitions = await new Promise((resolve, reject) => {
        (competitionsController.getAllCompetitions(req, res, (result) => {
            if (result.length > 0) {
                resolve(result || []);
            }
            else {
                return resolve([]);
            }
            return reject();
        }));
    });

    
    res.render("backoffice", {
        athletes: athletes,
        teams: teams,
        games: games,
        competitions: competitions
    });
};
export default { showBackoffice };
