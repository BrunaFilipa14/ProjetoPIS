import teamsController from "../../teams/controllers/teamsController.js";

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

export default { showAllTeams, showTeam};