import teamsController from "../../teams/controllers/teamsController.js";
import competitionsController from "../../competitions/controllers/competitionsController.js";


const showAllTeams = (req: any, res: any) => {

    teamsController.getAllTeams(req, res, (result) => {
        res.render("backofficeTeams", {
            teams: result,
        });
    });

}

const showTeam = (req: any, res: any) => {

    teamsController.getTeamByName(req, res, (result) => {
        res.render("backofficeTeams", {
            teams: result,
        });
    })
}

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

export default { showAllTeams, showTeam, showAllCompetitions, showCompetition};