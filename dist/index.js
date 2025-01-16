import express from "express";
import apiRouter from "./src/apiRouter.js";
import mustacheExpress from "mustache-express";
import { fileURLToPath } from "url";
import path from 'path';
// import cookieParser from 'cookie-parser';
import viewsRouter from "./src/components/views/routes/viewsRouter.js";
import searchRouter from "./src/components/search/routes/searchRouter.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//define a pasta public como estatica, tem de estar no inicio
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
// app.use(cookieParser());
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache'); //extensão dos ficheiros das views
app.set('views', __dirname + '/src/views'); //indicação de qual a pasta que irá conter as views
app.use("/api", apiRouter);
app.use("/view", viewsRouter);
app.use("/search", searchRouter);
app.get("/sign_up", (req, res) => {
    res.render("sign_up");
});
app.get("/sign_in", (req, res) => {
    res.render("sign_in");
});
app.get("/oi", (req, res) => {
    res.render("searchResults");
});
// app.use("/athletes", athletesRouter);
// app.use("/competitions", competitionsRouter);
// app.use("/statistics", statisticsRouter);
// app.use("/games", gamesRouter);
// app.use("/fav_athletes", favAthletesRouter);
// app.use("/fav_teams", favTeamsRouter);
//authentication
app.use('/', (req, res) => {
    res.render('index');
});
app.listen(8081, () => {
    console.log("Servidor aberto em http://localhost:8081");
});
