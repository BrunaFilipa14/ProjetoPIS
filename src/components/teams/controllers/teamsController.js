const path = require("path");
const mysql = require('mysql2');
const MYSQLPASSWORD = require("../../../scripts/mysqlpassword");
const { all } = require("../routes/teamsRouter");

console.log(MYSQLPASSWORD);
const connectionOptions = {
    host: "localhost",
    user: "root",
    password: MYSQLPASSWORD,
    database: "projeto"
};
const connection = mysql.createConnection(connectionOptions);
connection.connect();

const allTeams = (req,res) => {
    connection.query("SELECT * FROM teams", (err, rows, fields) => {
        if (err)
            console.log(err);
        else{
            res.status(200).render('teams', {
                teams: rows
            });
        }
    });
}

module.exports.allTeams = allTeams;