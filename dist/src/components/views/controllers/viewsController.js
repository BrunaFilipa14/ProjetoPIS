import teamsController from "../../teams/controllers/teamsController.js";
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
export default { showAllTeams, showTeam };
