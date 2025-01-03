import express from "express";
import teamsRouter from "./src/components/teams/routes/teamsRouter.js";
import mustacheExpress from "mustache-express";
import path from 'path';

const app : express.Application = express();

//define a pasta public como estatica, tem de estar no inicio
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache'); //extensão dos ficheiros das views
app.set('views', __dirname + '/src/views'); //indicação de qual a pasta que irá conter as views



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