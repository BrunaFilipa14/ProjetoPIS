"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamsRouter_js_1 = __importDefault(require("./src/components/teams/routes/teamsRouter.js"));
const mustache_express_1 = __importDefault(require("mustache-express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
//define a pasta public como estatica, tem de estar no inicio
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.engine('mustache', (0, mustache_express_1.default)());
app.set('view engine', 'mustache'); //extensão dos ficheiros das views
app.set('views', __dirname + '/src/views'); //indicação de qual a pasta que irá conter as views
app.use("/teams", teamsRouter_js_1.default);
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
});
