import express from "express";
import teamsRouter from "./src/components/teams/routes/teamsRouter.js";
import mustacheExpress from "mustache-express";

const app : express.Application = express();

//define a pasta public como estatica, tem de estar no inicio
app.use(express.static(__dirname + '/public'));

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache'); //extensão dos ficheiros das views
app.set('views', __dirname + '/src/views'); //indicação de qual a pasta que irá conter as views

app.use(express.urlencoded());
app.use(express.json());

app.use("/teams", teamsRouter);
// app.use("/athletes", athletesRouter);
// app.use("/competitions", competitionsRouter);
// app.use("/statistics", statisticsRouter);
// app.use("/games", gamesRouter);
// app.use("/fav_athletes", favAthletesRouter);
// app.use("/fav_teams", favTeamsRouter);


app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(8081, () => {
    console.log("Servidor aberto em http://localhost:8081");
})