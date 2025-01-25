import express from "express";
import mustacheExpress from "mustache-express";
import { fileURLToPath } from "url";
import path from 'path';
import cookieParser from 'cookie-parser';
import viewsRouter from "./src/components/views/routes/viewsRouter.js";
import searchRouter from "./src/components/search/routes/searchRouter.js";
import userRouter from "./src/components/user/routes/userRouter.js";
import backofficeRouter from "./src/components/backoffice/routes/backofficeRouter.js";
import verifyJWT from "./src/common/middlewares/verifyJWT.js";
import roles from "./src/components/user/controllers/userController.js";
import apiRouter from "./src/components/api/routes/apiRouter.js";
import logs from "./src/components/api/middlewares/apiMiddlewares.js";
const port = process.env.PORT || 8081;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//define a pasta public como estatica, tem de estar no inicio
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache'); //extensão dos ficheiros das views
app.set('views', __dirname + '/src/views'); //indicação de qual a pasta que irá conter as views
app.use("/api", verifyJWT, logs, apiRouter);
app.use("/view", verifyJWT, viewsRouter);
app.use("/search", verifyJWT, searchRouter);
app.use("/backoffice", verifyJWT, roles.authorize(1), backofficeRouter);
app.use("/auth", userRouter);
app.get("/sign_up", (req, res) => {
    res.render("sign_up");
});
app.get("/sign_in", (req, res) => {
    res.render("sign_in");
});
app.use('/user', verifyJWT, (req, res) => {
    res.render('index');
});
app.use('/', verifyJWT, roles.authorize(1), (req, res) => {
    res.render('indexAdmin');
});
app.listen(port, () => {
    console.log(`Servidor aberto em http://localhost:${port}`);
});
