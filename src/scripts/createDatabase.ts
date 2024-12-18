import * as mysql from  "mysql2";
import MYSQLPASSWORD from "./mysqlpassword.js";

const connectionOptions : mysql.ConnectionOptions = {
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD
}

const connection : mysql.Connection = mysql.createConnection(connectionOptions);

connection.connect((err) => {
    connection.query<mysql.ResultSetHeader>("CREATE DATABASE projeto;", (err : Error) => {
        if (err){
            console.log(err);
        }
        else{
            console.log("Database created!");
        }
    })
    connection.end((err) => {
        if (err) {
            console.error("Error closing the connection:", err);
        } else {
            console.log("connection closed.");
        }
    });
});