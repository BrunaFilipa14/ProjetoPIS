"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql2");
const mysqlpassword_js_1 = require("./mysqlpassword.js");
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: mysqlpassword_js_1.default
};
const connection = mysql.createConnection(connectionOptions);
connection.connect((err) => {
    connection.query("CREATE DATABASE projeto;", (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Database created!");
        }
    });
    connection.end((err) => {
        if (err) {
            console.error("Error closing the connection:", err);
        }
        else {
            console.log("connection closed.");
        }
    });
});
