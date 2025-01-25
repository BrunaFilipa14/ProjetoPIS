import express, {Request, Response, NextFunction } from "express";
import * as mysql from "mysql2";
import MYSQLPASSWORD from "../../../scripts/mysqlpassword.js";
const connectionOptions: mysql.ConnectionOptions = {
    host: "localhost",
    user: "root",
    database: "projeto",
    password: MYSQLPASSWORD
}

function logs (req : Request, res : Response, next : NextFunction) : void{

    const connection: mysql.Connection = mysql.createConnection(connectionOptions);

    let log = {
        OriginAddress: req.headers.referer,
        Timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        url: req.originalUrl
    }

    connection.query<mysql.ResultSetHeader>((`INSERT IGNORE INTO logs (log_origin_address, log_timestamp, log_url) VALUES ('${log.OriginAddress}','${log.Timestamp}','${log.url}');`), (err, result) => {
            if (err) {
                console.log(err);
            }
        });

    next();
}

export default logs;