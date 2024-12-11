const mysql = require("mysql2");
const MYSQLPASSWORD = require("./mysqlpassword.js");

const connection = mysql.createConnection ({
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD
});

connection.connect((err) => {
    connection.query("CREATE DATABASE projeto;", (err, result) => {
        if (err){
            console.log(err);
        }
        else{
            console.log("Database created!");
        }
    })
});
