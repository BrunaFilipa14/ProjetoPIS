import * as mysql from "mysql2";
import MYSQLPASSWORD from "./mysqlpassword.js";
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD
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
