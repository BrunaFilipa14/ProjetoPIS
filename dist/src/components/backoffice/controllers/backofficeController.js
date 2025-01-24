import teamsController from "../../teams/controllers/teamsController.js";
import athletesController from "../../athletes/controllers/athletesController.js";
const showBackoffice = async (req, res) => {
    let teams;
    let athletes;
    let games;
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
    // games = await new Promise((resolve, reject) => {
    //     (gamesController.getAllGames(req, res, (result) => {
    //             if (result.length > 0) {
    //                 resolve(result || []);
    //             }
    //             else{
    //                 return resolve([]);
    //             }
    //             return reject();
    //         }
    //     )
    // )});
    res.render("backoffice", {
        athletes: athletes,
        teams: teams,
        game: games
    });
};
export default { showBackoffice };
