import teamsController from "../../teams/controllers/teamsController.js";
import competitionsController from "../../competitions/controllers/competitionsController.js";
const showAllTeams = (req, res) => {
    teamsController.getAllTeams(req, res, (result) => {
        res.render("backofficeTeams", {
            teams: result,
        });
    });
};
const showTeam = (req, res) => {
    teamsController.getTeamByName(req, res, (result) => {
        res.render("backofficeTeams", {
            teams: result,
        });
    });
};
const showAllCompetitions = (req, res) => {
    competitionsController.getAllCompetitions(req, res, (result) => {
        res.render("backofficeCompetitions", {
            competitions: result,
        });
    });
};
const showCompetition = (req, res) => {
    teamsController.getTeamByName(req, res, (result) => {
        res.render("backofficeCompetitions", {
            competitions: result,
        });
    });
};
const showIndex = (req, res) => {
    res.render("index");
};
export default { showAllTeams, showTeam, showAllCompetitions, showCompetition, showIndex };
