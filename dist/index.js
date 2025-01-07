import express from "express";
import api from "./src/api.js";
import mustacheExpress from "mustache-express";
import { fileURLToPath } from "url";
import path from 'path';
import fetch from 'node-fetch';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//define a pasta public como estatica, tem de estar no inicio
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache'); //extensão dos ficheiros das views
app.set('views', __dirname + '/src/views'); //indicação de qual a pasta que irá conter as views


app.use("/api", api);
app.use("/teams", async (req, res) => {
    try {
        const response = await fetch("http://localhost:8081/api/teams");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const teamsData = await response.json();
        res.render("teams", {
            teams: teamsData,
        });
    }
    catch (error) {
        console.error("Error fetching teams data:", error);
        res.status(500).send("Error loading teams");
    }
});
app.get("/sign_up", (req, res) => {
    res.render("sign_up");
});
// app.use("/athletes", athletesRouter);
// app.use("/competitions", competitionsRouter);
// app.use("/statistics", statisticsRouter);
// app.use("/games", gamesRouter);
// app.use("/fav_athletes", favAthletesRouter);
// app.use("/fav_teams", favTeamsRouter);
//authentication
app.get('/', (req, res) => {
    res.render('sign_in');
});
app.listen(8081, () => {
    console.log("Servidor aberto em http://localhost:8081");
});
